import { storageService } from './storageService';

export const handleBackup = (activeBank) => {
  const data = {
    bankScore: storageService.getItem(`${activeBank}_score`, '0'),
    wrongQs: storageService.getJSON(`${activeBank}_wrongQ`, [])
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aws_quiz_backup_${activeBank}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
