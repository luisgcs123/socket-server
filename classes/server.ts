
import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {

    private static _intance: Server;
    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {

        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.escucharSockets();

    }

    public static get instance() {
        return this._intance || ( this._intance = new this() );
    }

    private escucharSockets() {
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {
            //console.log('Cliente conectado');

            // Configurar Usuario
            socket.conectarCliente( cliente , this.io );
            
            socket.configurarUsuario( cliente, this.io );

            // Obtener usuarios
            socket.obtenerUsuarios( cliente, this.io );
            
            //console.log(cliente.id);
            //socket.conectarCliente( cliente );
            socket.mensaje ( cliente, this.io );
            //Desconectar
            socket.desconectar( cliente, this.io );

            

            
        });
    }

    start( callback: any ) {

        this.httpServer.listen( this.port, callback );

    }
}