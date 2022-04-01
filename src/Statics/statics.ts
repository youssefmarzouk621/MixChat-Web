import { User } from "../models"

const connectedUser:User = {
    _id: "60cb38f5063b48abf6cedc2d",
    avatar: "youssef.jpeg",
    createdAt: "2021-06-17T11:58:45.131Z",
    email: "youssef.marzouk@esprit.tn",
    firstName: "Youssef",
    lastName: "Marzouk",
    password: "$2a$10$hGOIg4tdx.CHIm.Rs/gpWONcQYiiPczgpLdH7oJN8valJVpCt9KpK",
    phone: "90057620",
    updatedAt: "2021-06-17T11:58:45.131Z",
    verified: 1,
}
export default {
    baseUploadsURL: "http://localhost:5000/uploads/",
    //connectedId: "60cb38f5063b48abf6cedc2d",
    connectedUser: connectedUser
}
