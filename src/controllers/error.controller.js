class ErrorController{
	static handleError = async (res, error) => {
		if(error.code == 11000){
			console.log(error.keyValue);
			res.status(400).json({ errorCode:   + " bestaat al!" });
		} 
		else{
			res.status(400).json({ errorCode:  error + " Iets onverwachts gebeurde!" });
		}
	}
}

module.exports = ErrorController;
