import React from "react";
import skills from "../data/skills.json";
import dependenciesData from "../data/dependencies.json";

type Skill = {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
};

type Dependency = {
  skill_id: number;
  requires: number[];
}

export default function TechTree() {
  const [skillsData, setSkillsData] = React.useState<Skill[]>(skills);

  // build css grid definition

  const flattenedRequires: number[] = dependenciesData.flatMap((dep) => dep.requires);
  const counts: Record<number, number> = flattenedRequires.reduce((acc: Record<number, number>, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  
  const mostOccurences = Math.max(...Object.values(counts));
  const gridCols = (mostOccurences % 2 === 0) ? mostOccurences + 1 : mostOccurences;
  const gridRows = skillsData.length;

  const cssGridArray = []

  for (let i = 0; i <= gridRows - 1; i++) {
    const currentRow = []
    
    for (let j = 0; j <= gridCols - 1; j++) {
      currentRow.push(`a-${i}-${j}`)
    }

    cssGridArray.push(currentRow.join(" "))
  }

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

  const skillRows: Array<Dependency[]> = [];

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
      "block w-full text-center mb-2 ",
      skill.unlocked ? "opacity-100": "opacity-50"
    ]

    function findMatchingDependencies(skill_id: number): Dependency[] {
      // Get the dependencies for the skill_id
      const requiredSkills = dependenciesData[skill_id]?.requires;
    
      // Filter the dependencies array to find matches
      const matchingDependencies = dependenciesData.filter(dependency => {
        // Check if the dependency requires any of the required skills
        const hasCommonSkill = dependency.requires.some(requiredSkill => requiredSkills?.includes(requiredSkill));
    
        // Exclude dependencies that don't require any of the required skills
        return dependency !== dependenciesData[skill_id] && hasCommonSkill;
      });
    
      // Add the matched object for the skill_id to the array
      const matchedObject = dependenciesData[skill_id];
      if (matchedObject) {
        matchingDependencies.unshift(matchedObject);
      }
    
      return matchingDependencies.sort((a, b) => a.skill_id - b.skill_id);
    }

    const generatedSkillRow = findMatchingDependencies(skill.id)
    const generatedSkillRowString = JSON.stringify(generatedSkillRow);
    if (skillRows.map(row => JSON.stringify(row)).indexOf(generatedSkillRowString) < 0) {
      skillRows.push(generatedSkillRow);
    }
    const rowIndex = findContainingArrayIndex(skill.id)

    function findContainingArrayIndex(skillId: number) {
      for (let i = 0; i < skillRows.length; i++) {
        if (skillRows[i]?.some(item => item.skill_id === skillId)) {
          return i;
        }
      }
      return -1; // Skill ID not found in any array
    }

    let colPlacement = Math.floor(gridCols / 2);

    const tempSkillRowIndex = skillRows[rowIndex]?.indexOf(dependenciesData[skill.id]!) ?? 0
    if ( skillRows[rowIndex]?.length === 2) {
      colPlacement = (tempSkillRowIndex === 0) ? 0: 2
    } else if (skillRows[rowIndex]?.length === 3) {
      colPlacement = tempSkillRowIndex
    }

    const skillItemStyle = {
      gridArea: `a-${rowIndex}-${colPlacement}`,
    }

    return (
      <li
        key={skill.id}
        style={skillItemStyle}
      >
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

  // build style object for parent <ul></ul>
  const parentStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
    gridTemplateRows: `repeat(${gridRows}, 1fr)`,
    gridTemplateAreas: `'${cssGridArray.join("' '")}'`
  }

  // Render the top-level skill tree
  return <ul style={parentStyle}>{skillsData.map((skill) => renderSkill(skill))}</ul>;
}
