import Link from 'next/link';
import { Utensils, Users, QrCode } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-orange-600 mb-4">
          🍽️ Restaurante SaaS
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema de Pedidos Inteligente
        </p>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              ✅ Funcionando!
            </h2>
            <p className="text-gray-600">
              O frontend está carregando corretamente
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🚀 Próximos Passos
            </h3>
            <p className="text-gray-600">
              1. Execute o schema no Supabase<br/>
              2. Configure as variáveis no Netlify<br/>
              3. Teste a API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
