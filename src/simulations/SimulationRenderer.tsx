import React from "react";
import { Simulation, QuestionMode } from "../types/question";
import { BalanceLab } from "./BalanceLab";
import { CycleLab } from "./CycleLab";
import { GridRobotLab } from "./GridRobotLab";
import { GraphPathLab } from "./GraphPathLab";
import { MatchingLab } from "./MatchingLab";
import { DominoLab } from "./DominoLab";
import { TableMergeLab } from "./TableMergeLab";
import { ArrangementLab } from "./ArrangementLab";
import { TakeAwayGame } from "./TakeAwayGame";
import { EnergyGraphLab } from "./EnergyGraphLab";
import { ConstraintLab } from "./ConstraintLab";
import { BattleshipLab } from "./BattleshipLab";
import { SimulationPlaceholder } from "./SimulationPlaceholder";

interface SimulationRendererProps {
  simulation?: Simulation;
  mode: QuestionMode;
  questionTitle: string;
}

export const SimulationRenderer: React.FC<SimulationRendererProps> = ({
  simulation,
  mode,
  questionTitle,
}) => {
  if (!simulation) {
    return null;
  }

  switch (simulation.type) {
    case "balanceLab":
      return <BalanceLab config={simulation.config} mode={mode} />;

    case "cycleLab":
      return <CycleLab config={simulation.config} mode={mode} />;

    case "gridRobotLab":
      return <GridRobotLab config={simulation.config} mode={mode} />;

    case "graphPathLab":
      return <GraphPathLab config={simulation.config} mode={mode} />;

    case "matchingLab":
      return <MatchingLab config={simulation.config} mode={mode} />;

    case "dominoLab":
      return <DominoLab config={simulation.config} mode={mode} />;

    case "tableMergeLab":
      return <TableMergeLab config={simulation.config} mode={mode} />;

    case "arrangementLab":
      return <ArrangementLab config={simulation.config} mode={mode} />;

    case "takeAwayGame":
      return <TakeAwayGame config={simulation.config} mode={mode} />;

    case "energyGraphLab":
      return <EnergyGraphLab config={simulation.config} mode={mode} />;

    case "constraintLab":
      return <ConstraintLab config={simulation.config} mode={mode} />;

    case "battleshipLab":
      return <BattleshipLab config={simulation.config} mode={mode} />;

    default:
      return (
        <SimulationPlaceholder
          simulation={simulation}
          questionTitle={questionTitle}
        />
      );
  }
};

