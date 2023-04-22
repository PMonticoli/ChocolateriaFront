import { DetallePromocion } from "./detalle-promocion";
import { MovimientosPuntos } from "./movimientos-puntos";
import { Producto } from "./producto";
import { Promocion } from "./promocion";
import { Socio } from "./socio";

export class DtoPromociones {
    id : number;
    socio : Socio;
    promocion : Promocion;
    producto : Producto;
    cantidad : DetallePromocion;
    puntos : MovimientosPuntos;
}
