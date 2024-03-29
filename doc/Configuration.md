# Configuration Guide <br/> Logging Microservice

Logging microservice configuration structure follows the 
[standard configuration](http://docs.pipservices.org/toolkit/recipes/config_file_syntax/) 
structure. 

* [persistence](#persistence)
  - [persistence](#persistence_memory)
* [controller](#controller)
* [service](#service)
  - [http](#service_http)
  - [seneca](#service_seneca)

## <a name="persistence"></a> Persistence

This microservice supports currently supports only in-memory persistence. 
In the future other types of persistence will be added like file, AWS S3, etc.

For more information on this section read 
[Pip.Services Configuration Guide](https://github.com/pip-services/pip-services/blob/master/usage/Configuration.md)

### <a name="persistence_memory"></a> Memory

Memory persistence has the following configuration properties:
- options: object - Misc configuration options
  - max_page_size: number - Maximum number of items per page (default: 100)
  - max_error_size: number - Maximum number of stored errors (default: 1000)
  - max_total_size: number - Maximum number of all stored messages (default: 10000)

Example:
```yaml
- descriptor: "service-logging:persistence:memory:default:1.0"
  options:
    max_page_size: 100
    max_error_size: 100
    max_total_size: 1000
```

## <a name="controller"></a> Controller

The **controller** component containes the core business logic of the microservice.
Besides component descriptor it doesn't expect configuration options.

Example:
```yaml
- descriptor: "service-logging:controller:default:default:1.0"
```

## <a name="service"></a> Services

The **service** components (also called endpoints) expose external microservice API for the consumers. 
Each microservice can expose multiple APIs (HTTP/REST, Thrift or Seneca) and multiple versions of the same API type.
At least one service is required for the microservice to run successfully.

### <a name="service_http"></a> Http

HTTP service has the following configuration properties:
- connection: object - HTTP transport configuration options
  - type: string - HTTP protocol - 'http' or 'https' (default is 'http')
  - host: string - IP address/hostname binding (default is '0.0.0.0')
  - port: number - HTTP port number

A detailed description of HTTP/REST protocol version 1 can be found [here](HttpProtocolV1.md)

Example:
```yaml
- descriptor: "service-logging:service:commandable-http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 3000
```

### <a name="service_seneca"></a> Seneca

Seneca service has the following configuration properties:
- connection: object - Seneca transport configuration options. See http://senecajs.org/api/ for details.
  - type: string - Seneca transport type 
  - host: string - IP address/hostname binding (default is '0.0.0.0')
  - port: number - Seneca port number

A detail description of Seneca protocol version 1 can be found [here](SenecaProtocolV1.md)

Example:
```yaml
- descriptor: "service-logging:service:seneca:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 3000
```

For more information on this section read 
[Pip.Services Configuration Guide](https://github.com/pip-services/pip-services/blob/master/usage/Configuration.md)
