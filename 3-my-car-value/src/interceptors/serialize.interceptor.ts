import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable, map } from "rxjs";

// on créé une interface pour typer le parametre de Seraliaze
// definition d'une classe
interface ClassContructor {
    new (...args: any[]): {}
}

// own decorator !!
export function Serialize(dto: ClassContructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {

    constructor( private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before a request is handled by the request handler
        console.log( "I'm running before the handler" )

        return handler.handle().pipe(
            map( (data: any) => {
                // Run something before the response is sent out
                console.log( "i'm running before response is sent out" )

                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                })
            })
        )
    }
}