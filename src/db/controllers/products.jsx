export default function Product() {

    async function getProduct(){
        const postData = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/test`, postData
        );
        const response = await res.json();
        console.log(response.sku)
    }

    async function addProduct(){}

    async function deleteProduct(){}

    async function updateProduct(){}

} 