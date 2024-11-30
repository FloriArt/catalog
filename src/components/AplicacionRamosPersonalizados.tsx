import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flower, Plus, Minus, Send } from 'lucide-react';

// Define types for flower and extra items
interface FlowerItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

// Define the structure of the FLORES object
interface FloresCollection {
  floresPrincipales: FlowerItem[];
  floresMedianas: FlowerItem[];
  floresDecorativas: FlowerItem[];
  extras: FlowerItem[];
}

// Define the order state type
interface PedidoState {
  florPrincipal: FlowerItem | null;
  floresMedianas: FlowerItem[];
  floresDecorativas: FlowerItem[];
  extras: FlowerItem[];
  nombreCliente: string;
  telefonoCliente: string;
}

const placeholder = "/imgs/placeholders/default-flower.png"

// Inventario de flores con precios
const FLORES: FloresCollection = {
  floresPrincipales: [
    { id: 1, name: 'Rosas', price: 3.50, image: placeholder },
    { id: 2, name: 'Tulipanes', price: 2.75, image: placeholder },
    { id: 3, name: 'Lirios', price: 4.00, image: placeholder },
  ],
  floresMedianas: [
    { id: 4, name: 'Margaritas', price: 1.50, image: placeholder },
    { id: 5, name: 'Claveles', price: 1.25, image: placeholder },
    { id: 6, name: 'Aliento de Bebé', price: 1.00, image: placeholder },
    { id: 7, name: 'Girasoles', price: 1.75, image: placeholder },
    { id: 8, name: 'Crisantemos', price: 1.60, image: placeholder },
  ],
  floresDecorativas: [
    { id: 9, name: 'Eucalipto', price: 1.75, image: placeholder },
    { id: 10, name: 'Helechos', price: 1.25, image: placeholder },
    { id: 11, name: 'Follaje', price: 1.00, image: placeholder },
  ],
  extras: [
    { id: 12, name: 'Cinta', price: 2.00, image: placeholder },
    { id: 13, name: 'Jarrón', price: 5.00, image: placeholder },
    { id: 14, name: 'Chocolate', price: 3.50, image: placeholder },
  ]
};

const AplicacionRamosPersonalizados: React.FC = () => {
  const [pedido, setPedido] = React.useState<PedidoState>({
    florPrincipal: null,
    floresMedianas: [],
    floresDecorativas: [],
    extras: [],
    nombreCliente: '',
    telefonoCliente: '',
  });

  const calcularTotal = (): string => {
    let total = 0;
    if (pedido.florPrincipal) total += pedido.florPrincipal.price * 3;
    total += pedido.floresMedianas.reduce((sum, flower) => sum + flower.price, 0);
    total += pedido.floresDecorativas.reduce((sum, flower) => sum + flower.price, 0);
    total += pedido.extras.reduce((sum, extra) => sum + extra.price, 0);
    return total.toFixed(2);
  };

  const agregarElemento = (categoria: keyof FloresCollection, elemento: FlowerItem) => {
    switch(categoria) {
      case 'floresPrincipales':
        setPedido(prev => ({ ...prev, florPrincipal: elemento }));
        break;
      case 'floresMedianas':
        if (pedido.floresMedianas.length < 5) {
          if (!pedido.floresMedianas.some(f => f.id === elemento.id)) {
            setPedido(prev => ({ 
              ...prev, 
              floresMedianas: [...prev.floresMedianas, elemento] 
            }));
          }
        }
        break;
      case 'floresDecorativas':
        if (pedido.floresDecorativas.length < 2) {
          if (!pedido.floresDecorativas.some(f => f.id === elemento.id)) {
            setPedido(prev => ({ 
              ...prev, 
              floresDecorativas: [...prev.floresDecorativas, elemento] 
            }));
          }
        }
        break;
      case 'extras':
        if (!pedido.extras.some(e => e.id === elemento.id)) {
          setPedido(prev => ({ 
            ...prev, 
            extras: [...prev.extras, elemento] 
          }));
        }
        break;
    }
  };

  const eliminarElemento = (categoria: keyof FloresCollection, elementoAEliminar: FlowerItem) => {
    switch(categoria) {
      case 'floresPrincipales':
        setPedido(prev => ({ ...prev, florPrincipal: null }));
        break;
      case 'floresMedianas':
        setPedido(prev => ({ 
          ...prev, 
          floresMedianas: prev.floresMedianas.filter(item => item.id !== elementoAEliminar.id) 
        }));
        break;
      case 'floresDecorativas':
        setPedido(prev => ({ 
          ...prev, 
          floresDecorativas: prev.floresDecorativas.filter(item => item.id !== elementoAEliminar.id) 
        }));
        break;
      case 'extras':
        setPedido(prev => ({ 
          ...prev, 
          extras: prev.extras.filter(item => item.id !== elementoAEliminar.id) 
        }));
        break;
    }
  };

  const generarMensajeWhatsApp = () => {
    const { florPrincipal, floresMedianas, floresDecorativas, extras, nombreCliente, telefonoCliente } = pedido;
    const mensaje = `
Nuevo Pedido de Ramo Personalizado:

Cliente: ${nombreCliente}
Teléfono: ${telefonoCliente}

Flor Principal:
- ${florPrincipal ? florPrincipal.name : 'No seleccionada'}

Flores Medianas (${floresMedianas.length}/5):
${floresMedianas.map(f => `- ${f.name}`).join('\n') || 'Ninguna'}

Flores Decorativas (${floresDecorativas.length}/2):
${floresDecorativas.map(f => `- ${f.name}`).join('\n') || 'Ninguna'}

Extras:
${extras.map(e => `- ${e.name}`).join('\n') || 'Ninguno'}

Precio Total: $${calcularTotal()}
    `;

    // Note: Replace +XXXXXXXXXX with actual WhatsApp number
    const urlWhatsApp = `https://wa.me/+593987943116?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flower className="mr-2" /> Diseña Tu Ramo Personalizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Detalles del Cliente */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <Input 
              placeholder="Nombre del Cliente"
              value={pedido.nombreCliente}
              onChange={(e) => setPedido(prev => ({ ...prev, nombreCliente: e.target.value }))}
            />
            <Input 
              placeholder="Teléfono"
              value={pedido.telefonoCliente}
              onChange={(e) => setPedido(prev => ({ ...prev, telefonoCliente: e.target.value }))}
            />
          </div>

          {/* Secciones de Selección de Flores */}
          {(Object.keys(FLORES) as Array<keyof FloresCollection>).map((categoria) => (
            <div key={categoria} className="mb-6">
              <h3 className="text-lg font-semibold mb-2 capitalize">
                {categoria.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {FLORES[categoria].map((elemento) => (
                  <div 
                    key={elemento.id} 
                    className={`
                      border p-2 rounded-lg text-center cursor-pointer 
                      ${categoria === 'floresPrincipales' && pedido.florPrincipal?.id === elemento.id ? 'bg-blue-100' : ''}
                      ${categoria === 'floresMedianas' && pedido.floresMedianas.some(f => f.id === elemento.id) ? 'bg-blue-100' : ''}
                      ${categoria === 'floresDecorativas' && pedido.floresDecorativas.some(f => f.id === elemento.id) ? 'bg-blue-100' : ''}
                      ${categoria === 'extras' && pedido.extras.some(e => e.id === elemento.id) ? 'bg-blue-100' : ''}
                    `}
                  >
                    <img 
                      src={elemento.image} 
                      alt={elemento.name} 
                      className="mx-auto mb-2 w-24 h-24 object-cover"
                    />
                    <div>{elemento.name}</div>
                    <div className="text-sm text-gray-500">${elemento.price.toFixed(2)}</div>
                    
                    {/* Botones de Agregar/Eliminar con Lógica Condicional */}
                    {categoria === 'floresPrincipales' && (
                      pedido.florPrincipal?.id === elemento.id ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => eliminarElemento(categoria, elemento)}
                        >
                          <Minus className="mr-1" /> Quitar
                        </Button>
                      ) : (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => agregarElemento(categoria, elemento)}
                          disabled={!!pedido.florPrincipal}
                        >
                          <Plus className="mr-1" /> Seleccionar
                        </Button>
                      )
                    )}

                    {categoria === 'floresMedianas' && (
                      pedido.floresMedianas.some(f => f.id === elemento.id) ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => eliminarElemento(categoria, elemento)}
                        >
                          <Minus className="mr-1" /> Quitar
                        </Button>
                      ) : (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => agregarElemento(categoria, elemento)}
                          disabled={pedido.floresMedianas.length >= 5}
                        >
                          <Plus className="mr-1" /> Agregar
                        </Button>
                      )
                    )}

                    {categoria === 'floresDecorativas' && (
                      pedido.floresDecorativas.some(f => f.id === elemento.id) ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => eliminarElemento(categoria, elemento)}
                        >
                          <Minus className="mr-1" /> Quitar
                        </Button>
                      ) : (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => agregarElemento(categoria, elemento)}
                          disabled={pedido.floresDecorativas.length >= 2}
                        >
                          <Plus className="mr-1" /> Agregar
                        </Button>
                      )
                    )}

                    {categoria === 'extras' && (
                      pedido.extras.some(e => e.id === elemento.id) ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => eliminarElemento(categoria, elemento)}
                        >
                          <Minus className="mr-1" /> Quitar
                        </Button>
                      ) : (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => agregarElemento(categoria, elemento)}
                        >
                          <Plus className="mr-1" /> Agregar
                        </Button>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Resumen del Pedido y Envío por WhatsApp */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-xl font-bold">
              Precio Total: ${calcularTotal()}
            </div>
            <Button 
              onClick={generarMensajeWhatsApp}
              disabled={!pedido.florPrincipal || !pedido.nombreCliente || !pedido.telefonoCliente}
            >
              <Send className="mr-2" /> Enviar Pedido por WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AplicacionRamosPersonalizados;