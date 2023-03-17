import React from "react";
import skills from "../data/skills.json";
import dependenciesData from "../data/dependencies.json";

type Skill = {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
};

export default function TechTree() {
  const [skillsData, setSkillsData] = React.useState<Skill[]>(skills);

  // Define function to update the unlocked property of a skill
  const handleSkillClick = (skillId: number): void => {
    const updatedSkills = skillsData.map((skill): Skill => {
      if (skill.id === skillId) {
        return {
          ...skill,
          unlocked: true,
        };
      } else {
        return skill;
      }
    });

    setSkillsData(updatedSkills);
  };

  // Convert skills data to a map for easier lookups
  const skillsMap = new Map(
    skillsData.map((skill: Skill) => [skill.id, skill])
  );

  // Build the skill tree by recursively rendering sub-trees
  function renderSubTree(skill: Skill) {
    const dependantSkills: Skill[] = [];
    const dependantSkillsIds = dependenciesData.filter((dep) =>
      dep["requires"].includes(skill.id)
    );

    for (const dependantSkillsIdsEntry of dependantSkillsIds) {
      dependantSkills.push(
        skillsMap.get(dependantSkillsIdsEntry.skill_id) as Skill
      );
    }

    return (
      <li key={skill.id}>
        <button
          onClick={() => handleSkillClick(skill.id)}
          style={{opacity: (!skill.unlocked) ? "0.5" : "1"}}
        >
          {skill.name}
        </button>

        {
          skill.unlocked === true && (
            <ul>
              {dependantSkills.map((dep) => {
                if (dep?.id) {
                  return (renderSubTree(skillsData[dep.id] as Skill));
                }
              })}
            </ul>
          )
        }
      </li>
    );
  }

  // Render the top-level skill tree
  return <ul>{renderSubTree(skillsData[0] as Skill)}</ul>;
}
