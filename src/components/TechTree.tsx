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

  function renderSkill(skill: Skill) {
    // get ids of dependant skills
    const skillDependencies = dependenciesData.filter(
      (dep) => dep["skill_id"] === skill.id
    );

    // Check if any dependencies are locked. If there are, the item will be disabled
    const hasLockedDependencies: boolean =
      skillDependencies[0]?.requires?.some(
        (depId) => skillsMap.get(depId)?.unlocked === false
      ) ?? false;

    const buttonClasses: string[] = [
      "text-left mb-2 ",
      skill.unlocked ? "opacity-100": "opacity-50"
    ]

    return (
      <li key={skill.id}>
        <button
          className={buttonClasses.join("")}
          disabled={hasLockedDependencies}
          onClick={() => handleSkillClick(skill.id)}
        >
          {skill.name}
          {hasLockedDependencies && <span className="block text-xs">This item is can&apos;t be unlocked yet.</span>}
        </button>
      </li>
    );
  }

  // Render the top-level skill tree
  return <ul>{skillsData.map((skill) => renderSkill(skill))}</ul>;
}
