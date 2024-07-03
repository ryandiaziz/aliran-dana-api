class Response{
    static success(data, message = "Berhasil"){
        return {
            metaData : {
                status : true,
                message
            },
            response : {
                data
            }
        }
    }

    static failed(message){
        return {
            metaData : {
                status : false,
                message
            },
            response : null
        }
    }
}

export default Response;