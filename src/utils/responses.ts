export const responses = {
    success: (data: any)=>{
        return {
            "success": true,
            "data": data,
            "error": null
        }
    },

    error: (error: string) => {
        return {
            "success": false,
            "data": null,
            "error": error
        }
    }
}