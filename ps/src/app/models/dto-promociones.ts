import { DetallePromocion } from "./detalle-promocion";
import { MovimientosPuntos } from "./movimientos-puntos";
import { Producto } from "./producto";
import { Promocion } from "./promocion";
export class DtoPromociones {
    id : number;
    socio : string;
    promocion : string;
    producto : Producto;
    cantidad : DetallePromocion;
    puntos : MovimientosPuntos;
}
