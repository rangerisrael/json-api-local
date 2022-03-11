import express from 'express';
import { services } from './api.js';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running ${port}`);
});

app.use(express.json());

// Enable CORS for all requests
// References: https://expressjs.com/en/resources/middleware/cors.html
var corsOptions = {
  origin: 'http://localhost',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

app.get('/services', (req, res, next) => {
  services.get(function (data) {
    res.status(200).json({
      status: 200,
      statusText: 'OK',
      messagae: 'Success 202 Ok',
      data: data,
    });
  });
});

app.get('/services/filter', (req, res, next) => {
  let searchObject = {
    id: req.query.id,
    name: req.query.name,
  };

  services.filterServicesByQuery(searchObject, function (data) {
    res.status(200).json({
      status: 200,
      statusText: 'OK',
      message: 'Record filter success.',
      data: data,
    });
  });
});

app.get('/services/:id', (req, res, next) => {
  services.getByID(req.params.id, function (data) {
    if (!data) {
      res.status(404).send({
        status: 404,
        statusText: 'Not Found',
        message: "Invalid ID'" + req.params.id,
        error: {
          code: 'NOT_FOUND',
          message: "ID '" + req.params.id + "' could not be found.",
        },
      });
    }
    res.status(200).json({
      status: 200,
      statusText: 'OK',
      messagae: 'Success 202 Ok',
      data: data,
    });
  });
});

app.post('/services/create', (req, res, next) => {
  services.get(function (data) {
    let _record = data.filter((d) => d.id);
    req.body.id = _record.length + 1;

    let exist = data.find((rec) => rec.name === req.body.name);

    if (exist) {
      res.status(400).send({
        status: 400,
        statusText: 'Conflict',
        message: "Data has a same input '" + req.body.name,
        error: {
          code: 'Bad Request',
          message: "Duplicate Record '" + req.body.name,
        },
      });
    }

    services.createServices(
      req.body,
      function (data) {
        res.status(201).json({
          status: 201,
          statusText: 'Created',
          messagae: 'New file added',
          data: data,
        });
      },
      function (err) {
        next(err);
      }
    );
  });
});

app.put('/services/update/:id', (req, res, next) => {
  services.getByID(req.params.id, function (data) {
    if (!data) {
      res.status(404).send({
        status: 404,
        statusText: 'Not Found',
        message: "Invalid ID'" + req.params.id,
        error: {
          code: 'NOT_FOUND',
          message: "ID '" + req.params.id + "' could not be found.",
        },
      });
    }

    let exist = data.name === req.body.name;

    if (exist) {
      res.status(400).send({
        status: 400,
        statusText: 'Conflict',
        message: "Data has a same input '" + req.body.name,
        error: {
          code: 'Bad Request',
          message: "Duplicate Record '" + req.body.name,
        },
      });
    }

    services.updateServices(req.body, req.params.id, function (data) {
      res.status(201).json({
        status: 201,
        statusText: 'Accepted',
        messagae: 'Updated Request',
        data: data,
      });
    });
  });
});

app.delete('/services/deleted/:id', (req, res, next) => {
  services.getByID(req.params.id, function (data) {
    if (!data) {
      res.status(404).send({
        status: 404,
        statusText: 'Not Found',
        message: "Invalid ID'" + req.params.id,
        error: {
          code: 'NOT_FOUND',
          message: "ID '" + req.params.id + "' could not be found.",
        },
      });
    }

    services.deleteEachServices(req.params.id, function (data) {
      res.status(200).json({
        status: 200,
        statusText: 'Accepted',
        messagae: 'Deleted Request' + req.params.id,
        data: data,
      });
    });
  });
});

app.delete('/services/deletedAll', (req, res, next) => {
  services.deleteAllServices(function (data) {
    res.status(200).json({
      status: 200,
      statusText: 'Accepted',
      messagae: 'Deleted All Request',
      data: 'All record deleted successfully',
    });
  });
});



app.patch('/services/update/:id', (req, res, next) => {
  services.getByID(req.params.id, function (data) {
    if (!data) {
      res.status(404).send({
        status: 404,
        statusText: 'Not Found',
        message: "Invalid ID'" + req.params.id,
        error: {
          code: 'NOT_FOUND',
          message: "ID '" + req.params.id + "' could not be found.",
        },
      });
    }

    let exist = data.name === req.body.name;

    if (exist) {
      res.status(400).send({
        status: 400,
        statusText: 'Conflict',
        message: "Data has a same input '" + req.body.name,
        error: {
          code: 'Bad Request',
          message: "Duplicate Record '" + req.body.name,
        },
      });
    }

    services.updateServices(req.body, req.params.id, function (data) {
      res.status(201).json({
        status: 201,
        statusText: 'Accepted',
        messagae: 'Updated Request',
        data: data,
      });
    });
  });
});