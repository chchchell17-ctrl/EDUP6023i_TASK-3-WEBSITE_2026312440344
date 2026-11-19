import React, { createContext, useContext } from 'react';

export interface TeacherPlayContextValue {
  isTeacherMode: boolean;
  teacherName: string;
  allMapUnlocked: boolean;
  onUnlockAllMap: () => void;
  onReturnToTeacherPortal: () => void;
}

const DEFAULT_VALUE: TeacherPlayContextValue = {
  isTeacherMode: false,
  teacherName: '',
  allMapUnlocked: false,
  onUnlockAllMap: () => {},
  onReturnToTeacherPortal: () => {},
};

export const TeacherPlayContext = createContext<TeacherPlayContextValue>(DEFAULT_VALUE);

export const TeacherPlayProvider: React.FC<{
  value: TeacherPlayContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <TeacherPlayContext.Provider value={value}>{children}</TeacherPlayContext.Provider>
);

export function useTeacherPlayContext(): TeacherPlayContextValue {
  return useContext(TeacherPlayContext);
}
