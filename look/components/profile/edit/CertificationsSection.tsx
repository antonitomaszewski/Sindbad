'use client';

import { useState, useEffect } from 'react';
import type { Certification } from '../../../../logic/types/certification';

interface Props {
  selectedIds: string[];
  availableCertifications: Certification[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export default function CertificationsSection({ 
  selectedIds, 
  availableCertifications, 
  onChange,
  disabled = false 
}: Props) {
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedIds));

  useEffect(() => {
    setLocalSelected(new Set(selectedIds));
  }, [selectedIds]);

  function toggleCertification(certId: string) {
    const newSelected = new Set(localSelected);
    
    if (newSelected.has(certId)) {
      newSelected.delete(certId);
    } else {
      newSelected.add(certId);
    }
    
    setLocalSelected(newSelected);
    onChange(Array.from(newSelected));
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Uprawnienia żeglarskie
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Zaznacz certyfikaty, które posiadasz
      </p>

      {availableCertifications.length === 0 ? (
        <p className="text-gray-500 text-sm">Brak dostępnych certyfikatów</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableCertifications.map((cert) => {
            const isSelected = localSelected.has(cert.id);
            
            return (
              <label
                key={cert.id}
                className={`
                  flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition
                  ${isSelected 
                    ? 'border-main bg-main-soft' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => !disabled && toggleCertification(cert.id)}
                  disabled={disabled}
                  className="w-5 h-5 text-main rounded focus-ring-main"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {cert.name}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {localSelected.size > 0 && (
        <div className="mt-4 p-3 bg-main-soft border border-main-soft rounded-lg">
          <p className="text-sm text-main">
            Wybrano: <strong>{localSelected.size}</strong> {localSelected.size === 1 ? 'certyfikat' : 'certyfikaty'}
          </p>
        </div>
      )}
    </div>
  );
}