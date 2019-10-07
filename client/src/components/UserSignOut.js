const UserSignOut = props => {
    props.sign_out();
    // delete cookie if user manually signs out
    const cookieArray = document.cookie.split("; ");

    cookieArray.forEach(cookie => {
        let cookiePath = cookie.replace('user=; path=', '')
        
        cookiePath = cookiePath.substring(0, cookie.indexOf(';'));

        document.cookie = `user=; path=${cookiePath}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    });
    props.history.push("/courses");

    return null;
}

export default UserSignOut;
