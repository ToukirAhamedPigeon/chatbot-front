import React from 'react';
import { Difficulty } from '../types';
import { Badge } from './ui/Badge';
import { Gauge } from 'lucide-react';

interface DifficultyFilterProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export const DifficultyFilter: React.FC<DifficultyFilterProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
}) => {
  return (
    <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1 text-slate-500 text-sm mr-2">
        <Gauge size={16} />
        <span className="hidden sm:inline">লেভেল:</span>
      </div>
      
      <Badge 
        active={selectedDifficulty === Difficulty.EASY}
        onClick={() => onSelectDifficulty(Difficulty.EASY)}
        className="cursor-pointer"
      >
        সহজ
      </Badge>
      <Badge 
        active={selectedDifficulty === Difficulty.MEDIUM}
        onClick={() => onSelectDifficulty(Difficulty.MEDIUM)}
        className="cursor-pointer"
      >
        মাঝারি
      </Badge>
      <Badge 
        active={selectedDifficulty === Difficulty.HARD}
        onClick={() => onSelectDifficulty(Difficulty.HARD)}
        className="cursor-pointer"
      >
        কঠিন
      </Badge>
    </div>
  );
};
