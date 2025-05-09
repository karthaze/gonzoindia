const utils = {
    handleLogin:() => {
        //if (user) {
          //navigate('/GJFeedPage');
        //} else {
          window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
        //}
    },
}

export default utils;