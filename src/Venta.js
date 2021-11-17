import React, { Component } from "react";
import "./Venta.css";

export default class Venta extends Component {
  constructor(props) {
    super(props);

    this.calcularMonto = this.calcularMonto.bind(this);
    this.confirmarCompra = this.confirmarCompra.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeProducto = this.handleChangeProducto.bind(this);
    this.editProducto = this.editProducto.bind(this);

    this.state = {
      cliente: 7,
      form: {
        productList: [],
        card: "",
      },
      creditCards: [],
      products: [],
      discounts: [],
      sales: [],
      total: "",
      result: "",
      message: "",
      product: {
        codigo: "",
        marca: "",
        descripcion: "",
        precio: "",
        categoria: "",
        version: "",
      },
      classes: [],
    };
  }

  componentDidMount() {
    fetch("http://localhost:7000/productos")
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          products: json.products,
        })
      );

    fetch("http://localhost:7000/descuentos")
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          discounts: json.discounts,
        })
      );

    fetch("http://localhost:7000/tarjetas")
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          creditCards: json.creditCards,
        })
      );

    fetch("http://localhost:7000/ventas")
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          sales: json.sales,
        })
      );

    fetch("http://localhost:7000/update")
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          product: json.product,
          classes: json.classes,
        })
      );
  }

  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;

    this.setState((state) => ({
      form: {
        ...state.form,
        [name]: value,
      },
    }));
  }

  handleChangeProducto(e) {
    let name = e.target.name;
    let value = e.target.value;

    this.setState((state) => ({
      product: {
        ...state.product,
        [name]: value,
      },
    }));
  }

  handleSelect(e) {
    this.setState((state) => ({
      form: {
        ...state.form,
        productList: Array.from(
          e.target.selectedOptions,
          (element) => element.value
        ),
      },
    }));
  }

  handleSubmit(e) {
    e.preventDefault();

    let action = e.target.value;

    fetch("http://localhost:7000/" + action, {
      method: "POST",
      body: JSON.stringify({
        cliente: this.state.cliente,
        detalle: this.state.form.productList,
        tarjeta: this.state.form.card,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          result: json.result,
          message: json.message,
          total: json.monto,
        });
      });
  }

  confirmarCompra(e) {
    e.preventDefault();

    fetch("http://localhost:7000/compra", {
      method: "POST",
      body: JSON.stringify({
        cliente: this.state.cliente,
        detalle: this.state.form.productList,
        tarjeta: this.state.form.card,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          result: json.result,
          message: json.message,
        });
      });
  }

  calcularMonto(e) {
    e.preventDefault();

    fetch("http://localhost:7000/monto", {
      method: "POST",
      body: JSON.stringify({
        cliente: this.state.cliente,
        detalle: this.state.form.productList,
        tarjeta: this.state.form.card,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          result: json.result,
          message: json.message,
          total: json.monto,
        });
      });
  }

  editProducto(e) {
    e.preventDefault();
    fetch("http://localhost:7000/update", {
      method: "POST",
      body: JSON.stringify({
        codigo: this.state.product.codigo,
        marca: this.state.product.marca,
        descripcion: this.state.product.descripcion,
        precio: this.state.product.precio,
        categoria: this.state.product.categoria,
        version: this.state.product.version,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          result: json.result,
          message: json.message,
        });
      });
  }

  render() {
    return (
      <div id="Venta-app">
        <div className="Venta">
          <form>
            <label> Seleccione productos:</label>
            <select
              name="productList"
              multiple={true}
              value={this.state.form.productList}
              onChange={this.handleSelect}
            >
              {this.state.products.map((product) => (
                <option key={product.codigo} value={product.codigo}>
                  {product.descripcion +
                    " $" +
                    product.precio +
                    " - " +
                    product.marca}
                </option>
              ))}
            </select>
            <label> Seleccione una tarjeta:</label>
            <select
              name="card"
              value={this.state.form.card}
              onChange={this.handleChange}
            >
              {this.state.creditCards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.empresa}
                </option>
              ))}
            </select>
            <div className="buttonBox">
              <button onClick={this.calcularMonto} type="submit">
                Calcular Monto
              </button>
              <button onClick={this.confirmarCompra} type="submit">
                Abonar compra
              </button>
            </div>
          </form>
        </div>
        <div className="discounts">
          {this.state.discounts.map((discount) => (
            <p key={discount.id}>
              {discount.fechaInicio +
                " hasta " +
                discount.fechaFin +
                " " +
                discount.promocionable +
                ": " +
                discount.descuento * 100 +
                "%"}
            </p>
          ))}
        </div>
        <div className="message-box">
          <p className={this.state.result}>
            {this.state.message} {this.state.total}
          </p>
        </div>
        <div className="sales">
          <table>
            <thead>
              <tr>
                <td>Fecha</td>
                <td>Total</td>
                <td>Tarjeta</td>
                <td>Productos comprados</td>
                <td>Id</td>
              </tr>
            </thead>
            <tbody>
              {this.state.sales.map((sale) => (
                <tr>
                  <td>{sale.fechaHora}</td>
                  <td>{sale.total}</td>
                  <td>{sale.tarjeta}</td>
                  <td>
                    {sale.detalle.productosVendidos.map((prodVendido) => (
                      <>
                        <p>
                          {prodVendido.descripcion + " - " + prodVendido.precio}
                        </p>
                      </>
                    ))}
                  </td>
                  <td>{sale.yearId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="editarProducto">
          <form>
            <label>ID</label>
            <input
              type="text"
              contentEditable={false}
              name="codigo"
              value={this.state.product.codigo}
            ></input>
            <label>Descripcion</label>
            <input
              type="text"
              value={this.state.product.descripcion}
              id="descripcion"
              name="descripcion"
              onChange={this.handleChangeProducto}
            ></input>
            <label>Precio</label>
            <input
              type="text"
              defaultValue={this.state.product.precio}
              name="precio"
              onChange={this.handleChangeProducto}
            ></input>
            <label>Marca</label>
            <input
              type="text"
              defaultValue={this.state.product.marca}
              name="marca"
              onChange={this.handleChangeProducto}
            ></input>
            <label></label>
            <label> Categoría </label>
            <select
              name="categoria"
              defaultValue={this.state.product.categoria}
              onChange={this.handleChangeProducto}
            >
              {this.state.classes.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
            <input
              type="hidden"
              name="version"
              value={this.state.product.version}
            ></input>
            <div>
              <button onClick={this.editProducto} type="submit">
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
