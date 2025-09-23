import React, { createContext, useState, useEffect, useContext } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);

  // Cargar productos desde localStorage al cargar el componente
  useEffect(() => {
    const memoria = JSON.parse(localStorage.getItem('carrito')) || [];
    setProductos(memoria);
    actualizarNumeroCarrito(memoria);
  }, []);

  // Función para actualizar el total del carrito
  const actualizarNumeroCarrito = (memoria) => {
    const cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0);
    setTotalCarrito(cuenta);
  };

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    setProductos((prevProductos) => {
      const memoria = [...prevProductos];
      const indiceProducto = memoria.findIndex((pro) => pro.id === producto.id);

      if (indiceProducto === -1) {
        memoria.push({ ...producto, cantidad: 1 });
      } else {
        memoria[indiceProducto].cantidad++;
      }

      localStorage.setItem('carrito', JSON.stringify(memoria));
      actualizarNumeroCarrito(memoria);
      return memoria;
    });
  };

  // Función para restar un producto del carrito
  const restarDelCarrito = (producto) => {
    setProductos((prevProductos) => {
      const memoria = [...prevProductos];
      const indiceProducto = memoria.findIndex((pro) => pro.id === producto.id);

      if (indiceProducto !== -1 && memoria[indiceProducto].cantidad > 1) {
        memoria[indiceProducto].cantidad--;
      } else {
        memoria.splice(indiceProducto, 1); // Eliminar el producto si la cantidad es 1
      }

      localStorage.setItem('carrito', JSON.stringify(memoria));
      actualizarNumeroCarrito(memoria);
      return memoria;
    });
  };

  return (
    <CarritoContext.Provider value={{ productos, totalCarrito, agregarAlCarrito, restarDelCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

export default CarritoContext;
