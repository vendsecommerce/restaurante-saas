import Link from 'next/link';
import { Utensils, Users, QrCode } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Utensils className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Restaurante SaaS
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Users className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Sistema de Pedidos
            <span className="block text-orange-600">Inteligente</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Faça seus pedidos de forma rápida e fácil. Escaneie o QR code da sua mesa e comece a pedir!
          </p>
        </div>

        {/* Features */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mb-4">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Escaneie o QR Code
              </h3>
              <p className="text-gray-500">
                Cada mesa possui um QR code único. Escaneie para acessar o cardápio digital.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Faça Seus Pedidos
              </h3>
              <p className="text-gray-500">
                Navegue pelo cardápio, escolha seus pratos favoritos e adicione ao carrinho.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Acompanhe em Tempo Real
              </h3>
              <p className="text-gray-500">
                Receba atualizações em tempo real sobre o status do seu pedido.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Experimente Agora
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Mesa de Demonstração
              </h4>
              <p className="text-gray-500 mb-6">
                Teste o sistema com nossa mesa de demonstração
              </p>
              <Link
                href="/mesa/1"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Acessar Mesa 1
              </Link>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Painel Administrativo
              </h4>
              <p className="text-gray-500 mb-6">
                Gerencie pedidos, cardápio e mesas
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Acessar Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; 2024 Restaurante SaaS. Todos os direitos reservados.</p>
        </footer>
      </main>
    </div>
  );
}
