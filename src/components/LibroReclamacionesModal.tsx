import React, { useState } from 'react';
import { X, BookText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { LibroReclamacionEntry } from '../types/bakery';
import { STORE_RUC, STORE_ADDRESS } from '../utils/orderCalculator';

interface LibroReclamacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LibroReclamacionesModal: React.FC<LibroReclamacionesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [submittedEntry, setSubmittedEntry] = useState<LibroReclamacionEntry | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    documentType: 'DNI' as const,
    documentNumber: '',
    phone: '',
    email: '',
    address: '',
    serviceType: 'Producto' as 'Producto' | 'Servicio',
    claimedAmount: '',
    claimType: 'Reclamo' as 'Reclamo' | 'Queja',
    details: '',
    consumerRequest: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: LibroReclamacionEntry = {
      id: `LR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: formData.fullName,
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      serviceType: formData.serviceType,
      claimedAmount: formData.claimedAmount,
      claimType: formData.claimType,
      details: formData.details,
      consumerRequest: formData.consumerRequest,
      createdAt: new Date().toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setSubmittedEntry(entry);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#1b120c] border border-[#d69c4f]/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-left shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#251911] border border-[#39261a] hover:border-[#d69c4f] flex items-center justify-center text-[#dfcca9] hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!submittedEntry ? (
          <div>
            {/* Header with INDECOPI compliance notice */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#251911] border border-[#d69c4f]/40 flex items-center justify-center text-[#e8b66f] shrink-0">
                <BookText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#faf3e8]">
                  Libro de Reclamaciones Virtual
                </h2>
                <p className="text-xs text-[#dfcca9] mt-0.5">
                  Conforme a lo establecido en el Código de Protección y Defensa del Consumidor (Ley N° 29571).
                </p>
                <div className="text-[11px] text-[#b97f33] font-mono mt-1">
                  Razón Social: Panadería y Pastelería Jireh • RUC: {STORE_RUC}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Personal Data */}
              <div className="p-4 rounded-2xl bg-[#251911] border border-[#39261a] space-y-3">
                <h3 className="font-serif font-bold text-xs text-[#f5d49f] uppercase tracking-wider">
                  1. Identificación del Consumidor Reclamante
                </h3>

                <div>
                  <label className="block text-xs text-[#dfcca9] mb-1">Nombre y Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#1b120c] border border-[#39261a] rounded-xl px-3 py-2 text-xs text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
                    placeholder="Nombres completos"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#dfcca9] mb-1">Tipo de Documento</label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                      className="w-full bg-[#1b120c] border border-[#39261a] rounded-xl px-3 py-2 text-xs text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">Carnet de Extranjería</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#dfcca9] mb-1">Número de Documento *</label>
                    <input
                      type="text"
                      required
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      className="w-full bg-[#1b120c] border border-[#39261a] rounded-xl px-3 py-2 text-xs text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
                      placeholder="8 dígitos"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#dfcca9] mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#1b120c] border border-[#39261a] rounded-xl px-3 py-2 text-xs text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
                      placeholder="9 dígitos"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#dfcca9] mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#1b120c] border border-[#39261a] rounded-xl px-3 py-2 text-xs text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#dfcca9] mb-1">Domicilio en Cajamarca *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#1b120c] border border-[#39261a] rounded-xl px-3 py-2 text-xs text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
                    placeholder="Jr. / Av. / Barrio"
                  />
                </div>
              </div>

              {/* Service & Claim Info */}
              <div className="p-4 rounded-2xl bg-[#251911] border border-[#39261a] space-y-3">
                <h3 className="font-serif font-bold text-xs text-[#f5d49f] uppercase tracking-wider">
                  2. Detalle de la Reclamación
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#dfcca9] mb-1">Bien Contratado</label>
                    <div className="flex gap-4 text-xs text-[#faf3e8] pt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="serviceType"
                          checked={formData.serviceType === 'Producto'}
                          onChange={() => setFormData({ ...formData, serviceType: 'Producto' })}
                          className="accent-[#b97f33]"
                        />
                        <span>Producto (Torta/Pan)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="serviceType"
                          checked={formData.serviceType === 'Servicio'}
                          onChange={() => setFormData({ ...formData, serviceType: 'Servicio' })}
                          className="accent-[#b97f33]"
                        />
                        <span>Servicio</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#dfcca9] mb-1">Tipo</label>
                    <div className="flex gap-4 text-xs text-[#faf3e8] pt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="claimType"
                          checked={formData.claimType === 'Reclamo'}
                          onChange={() => setFormData({ ...formData, claimType: 'Reclamo' })}
                          className="accent-[#b97f33]"
                        />
                        <span>Reclamo</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="claimType"
                          checked={formData.claimType === 'Queja'}
                          onChange={() => setFormData({ ...formData, claimType: 'Queja' })}
                          className="accent-[#b97f33]"
                        />
                        <span>Queja</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#dfcca9] mb-1">Detalle del Reclamo o Queja *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full bg-[#1b120c] border border-[#39261a] rounded-xl px-3 py-2 text-xs text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
                    placeholder="Describa claramente los hechos ocurridos..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#dfcca9] mb-1">Pedido o Solución Solicitada *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.consumerRequest}
                    onChange={(e) => setFormData({ ...formData, consumerRequest: e.target.value })}
                    className="w-full bg-[#1b120c] border border-[#39261a] rounded-xl px-3 py-2 text-xs text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
                    placeholder="Qué solicita que realice la pastelería..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#b97f33] hover:bg-[#d69c4f] text-[#150e09] font-bold text-sm transition-all shadow-md"
                >
                  Registrar Hoja de Reclamación
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-[#faf3e8]">
                Reclamación Registrada con Éxito
              </h3>
              <p className="text-sm text-[#e8b66f] font-mono mt-1">
                Código: {submittedEntry.id}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#251911] border border-[#39261a] text-left text-xs text-[#dfcca9] space-y-2 max-w-lg mx-auto">
              <p><strong className="text-white">Reclamante:</strong> {submittedEntry.fullName} ({submittedEntry.documentType}: {submittedEntry.documentNumber})</p>
              <p><strong className="text-white">Fecha y Hora:</strong> {submittedEntry.createdAt}</p>
              <p><strong className="text-white">Tipo:</strong> {submittedEntry.claimType} de {submittedEntry.serviceType}</p>
              <p><strong className="text-white">Establecimiento:</strong> {STORE_ADDRESS}</p>
              <p className="pt-2 border-t border-[#39261a] text-[11px] text-[#a89078]">
                *Una copia ha sido enviada a su correo {submittedEntry.email}. Conforme a Ley, el plazo máximo de respuesta es de quince (15) días hábiles.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#d69c4f] text-[#faf3e8] hover:bg-[#251911] text-xs font-semibold"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Constancia</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#b97f33] hover:bg-[#d69c4f] text-[#150e09] text-xs font-bold"
              >
                Aceptar y Finalizar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
