class ResponseHeaderFilters {
    def filters = {
        all(controller:'*', action:'*') {
            before = {
                if (request.getHeader('X-Requested-With')?.equals('XMLHttpRequest')) {
                    response.setHeader('Expires', '-1')
                    response.setHeader('Cache-Control', 'no-cache')
                }
            }
        }
    }
}
