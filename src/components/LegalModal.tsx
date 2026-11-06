import React from 'react';
import { X, Shield, FileText, Truck, HelpCircle, Cookie } from 'lucide-react';
import { FAQS } from '../data/bakeryData';
import { STORE_RUC, STORE_ADDRESS } from '../utils/orderCalculator';

export type LegalModalType = 'terms' | 'privacy' | 'cookies' | 'delivery' | 'faq' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const getContent = () => {
    switch (type) {
      case 'terms':
        return {
          icon: <FileText className="w-6 h-6 text-[#e8b66f]" />,
          title: 'Términos y Condiciones',
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-[#dfcca9] leading-relaxed">
              <p>
                Bienvenido a <strong className="text-white">JIRÉH Panadería y Pastelería</strong> (RUC: {STORE_RUC}). Al utilizar este sitio web o encargar productos, usted acepta las condiciones descritas a continuación.
              </p>
              <h4 className="font-serif font-bold text-white text-sm">1. Elaboración y Pedidos</h4>
              <p>
                Nuestros productos son 100% artesanales y preparados bajo pedido en Cajamarca. Por la naturaleza manual de la decoración de tortas, pueden existir ligeras variaciones estéticas respecto a fotos de muestra, manteniendo siempre el más alto estándar de sabor y textura.
              </p>
              <h4 className="font-serif font-bold text-white text-sm">2. Pagos y Anticipos</h4>
              <p>
                Para tortas personalizadas se requiere un adelanto del 50% al momento de confirmar el pedido y el saldo restante contraentrega o previo al despacho.
              </p>
              <h4 className="font-serif font-bold text-white text-sm">3. Modificaciones o Cancelaciones</h4>
              <p>
                Modificaciones en el diseño o fecha deben solicitarse con al menos 24 horas de antelación para pedidos estándar, y 48 horas para bodas o eventos grandes.
              </p>
            </div>
          ),
        };

      case 'privacy':
        return {
          icon: <Shield className="w-6 h-6 text-[#e8b66f]" />,
          title: 'Políticas de Privacidad',
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-[#dfcca9] leading-relaxed">
              <p>
                En cumplimiento de la Ley N° 29733 (Ley de Protección de Datos Personales de Perú), JIRÉH Panadería y Pastelería garantiza el tratamiento confidencial de los datos que usted proporciona al contactarnos por WhatsApp o formularios.
              </p>
              <h4 className="font-serif font-bold text-white text-sm">1. Uso de los datos</h4>
              <p>
                Sus nombres, teléfonos y direcciones se utilizan exclusivamente para procesar cotizaciones, entregas a domicilio y facturación electrónica. No comercializamos ni transferimos sus datos a terceros.
              </p>
              <h4 className="font-serif font-bold text-white text-sm">2. Derechos ARCO</h4>
              <p>
                Usted puede solicitar en cualquier momento la actualización o eliminación de sus datos escribiendo a nuestro WhatsApp oficial o visitando nuestro local en {STORE_ADDRESS}.
              </p>
            </div>
          ),
        };

      case 'cookies':
        return {
          icon: <Cookie className="w-6 h-6 text-[#e8b66f]" />,
          title: 'Política de Cookies',
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-[#dfcca9] leading-relaxed">
              <p>
                Este sitio web utiliza cookies técnicas esenciales y de rendimiento que permiten recordar sus preferencias de visualización (como el modo 3D y filtros de catálogo) sin recopilar información personal sensible.
              </p>
              <p>
                Usted puede configurar o deshabilitar las cookies desde las opciones de su navegador en cualquier momento sin afectar la navegación general del sitio.
              </p>
            </div>
          ),
        };

      case 'delivery':
        return {
          icon: <Truck className="w-6 h-6 text-[#e8b66f]" />,
          title: 'Políticas de Entrega y Devoluciones',
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-[#dfcca9] leading-relaxed">
              <h4 className="font-serif font-bold text-white text-sm">1. Cobertura de Despacho</h4>
              <p>
                Realizamos entregas a domicilio dentro del casco urbano de Cajamarca y zonas aledañas (Baños del Inca, Tartar, Santa Bárbara) previa coordinación de tarifa por distancia.
              </p>
              <h4 className="font-serif font-bold text-white text-sm">2. Recepción de Tortas</h4>
              <p>
                Las tortas son transportadas en cajas reforzadas con base rígida. Al momento de la entrega, se solicita al cliente verificar la integridad de la decoración y firmar la conformidad o enviar el OK por WhatsApp.
              </p>
              <h4 className="font-serif font-bold text-white text-sm">3. Devoluciones</h4>
              <p>
                Por tratarse de alimentos frescos perecibles, no se aceptan devoluciones una vez entregado el producto en conformidad, salvo desperfecto comprobable en la masa o crema antes de su consumo.
              </p>
            </div>
          ),
        };

      case 'faq':
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 text-[#e8b66f]" />,
          title: 'Preguntas Frecuentes (FAQ)',
          body: (
            <div className="space-y-4 text-xs sm:text-sm">
              {FAQS.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#251911] border border-[#39261a] text-left">
                  <h4 className="font-serif font-bold text-[#faf3e8] text-sm mb-1.5">
                    {faq.q}
                  </h4>
                  <p className="text-[#dfcca9] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          ),
        };
    }
  };

  const current = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#1b120c] border border-[#d69c4f]/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-left shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#251911] border border-[#39261a] hover:border-[#d69c4f] flex items-center justify-center text-[#dfcca9] hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#251911] border border-[#d69c4f]/40 flex items-center justify-center shrink-0">
            {current.icon}
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#faf3e8]">
            {current.title}
          </h3>
        </div>

        {current.body}

        <div className="pt-6 border-t border-[#39261a] mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#b97f33] hover:bg-[#d69c4f] text-[#150e09] font-bold text-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
