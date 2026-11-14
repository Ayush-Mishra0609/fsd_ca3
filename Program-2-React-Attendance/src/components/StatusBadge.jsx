import React from 'react';

/**
 * Reusable Functional Component: StatusBadge
 * Props:
 *  - status: 'Present' | 'Late' | 'Absent'
 */
export default function StatusBadge({ status }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Present':
        return { className: 'badge-present', icon: '●', label: 'Present' };
      case 'Late':
        return { className: 'badge-late', icon: '▲', label: 'Late' };
      case 'Absent':
        return { className: 'badge-absent', icon: '■', label: 'Absent' };
      default:
        return { className: 'badge-default', icon: '○', label: status };
    }
  };

  const { className, icon, label } = getBadgeConfig();

  return (
    <span className={`status-badge ${className}`}>
      <span className="badge-bullet">{icon}</span>
      <span>{label}</span>
    </span>
  );
}
