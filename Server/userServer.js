import * as DB from "../js/db-api";

export function handleUsersRequest(method, endpoint, data) {
    switch (method) {
        case "GET":
            const user = DB.findUser(data.email);
            if (user) {
                if (user.password !== data.password) {
                    return { status: 401, data: { message: "Invalid password" } };
                }  
                return { status: 200, data: user };
            }
        case "POST":
            const newUser = DB.addUserData(data);
            if (!newUser) {
                return { status: 409, data: { message: "User already exists" } };
            }
            return { status: 201, data: newUser };
        
        default:
            return { status: 400, data:{message: "Invalid User request" }  };

    }
};