function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

const exampleContacts = {
    "johndoe@example.com": {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "123-456-7890",
        country: "USA",
        city: "New York",
        address: "123 Street, NY",
        photo: "https://via.placeholder.com/100"
    },
    "janesmith@example.com": {
        name: "Jane Smith",
        email: "janesmith@example.com",
        phone: "987-654-3210",
        country: "Canada",
        city: "Toronto",
        address: "456 Avenue, ON",
        photo: "https://via.placeholder.com/100"
    },
    "michaelbrown@example.com": {
        name: "Michael Brown",
        email: "michaelbrown@example.com",
        phone: "555-678-1234",
        country: "UK",
        city: "London",
        address: "789 Road, London",
        photo: "https://via.placeholder.com/100"
    }
};

// Save to localStorage
const userEmail = getCookie('userEmail');
localStorage.setItem(userEmail, JSON.stringify(exampleContacts));
console.log("Example contacts saved to localStorage!");
