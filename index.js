const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;
let db = require("./db");
// Integracion del body-parser
app.use(bodyParser.json())
// Corriendo servidor
app.listen(port, () => {
    console.log('Servidor activo');
});


// Endpoint
// get      -> Traer informacion
// post     -> Creamos un objeto y consultas
// put      -> Actualizar información en especifico o varios
// delete   -> Eliminar uno o varios registros


//  Endpoint de consulta
//  http://localhost:3000
app.get("/", (req, res) => {
    res.send('Servidor Activo');
})

//  Endpoint de consulta
//  http://localhost:3000/users
app.get("/users", (req, res) => {
    const resultado =
    {
        total: db.length,
        rows: db,
        msg: 'ok'
    }
    res.json(resultado);
})

// Endpoint de agregar elemento
// http://localhost:3000/users
app.post("/users", (req, res) => {
    // select 
    const found = db.find((element) => {
        if (parseInt(element.id) === parseInt(req.body.id)) {
            return element
        }
    })
    if (req.body.name === '') {
        res.status(400).json({ msg: 'Digita el nombre' })
    } else {
        if (found !== undefined) {
            res.status(400).json({ msg: 'El id ' + req.body.id + ' ya existe en la BD' })
        } else {
            //insert into 
            db.push(req.body)
            const resultado =
            {
                total: db.length,
                rows: db,
                msg: 'ok'
            }
            res.json(resultado);
        }
    }
})

//  Endpoint de consulta
//  http://localhost:3000/users/id
app.get("/users/:id", (req, res) => {
    let found = db.find((element) => {
        if (parseInt(element.id) === parseInt(req.params.id)) {
            return element
        }
    })
    if (!found) { found = {} }
    const resultado =
    {
        row: found,
        msg: 'ok'
    }
    res.json(resultado);
})

//  Endpoint de Actualizacion
//  http://localhost:3000/users/id
app.put("/users/:id", (req, res) => {
    let updateRow = {}
    let msg = '';
    let found = db.find((element) => {
        if (parseInt(element.id) === parseInt(req.params.id)) {
            return element
        }
    })
    if (!found) {
        updateRow = {}
        msg = 'El usuario no existe'
    } else {
        db.map(
            (element) => {
                if (parseInt(element.id) === parseInt(req.params.id)) {
                    element = req.body
                    element.id = parseInt(req.params.id);
                    updateRow = req.body
                    msg = 'Usuario Actualizado';
                }
            }
        )
    }
    const resultado =
    {
        row: updateRow,
        msg: msg
    }
    res.json(resultado);
})

//  Endpoint de Eliminar
//  http://localhost:3000/users/id
app.delete("/users/:id", (req, res) => {
    let found = db.find((element) => {
        if (parseInt(element.id) === parseInt(req.params.id)) {
            return element
        }
    })
    if (!found) {
        res.status(400).json({ msg: 'El id que enviaste no existe' })
    } else {
        db = db.filter((element) => parseInt(element.id) !== parseInt(req.params.id))
        const resultado =
        {
            total: db.length,
            rows: db,
            msg: 'ok'
        }
        res.json(resultado);
    }
})