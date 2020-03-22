
export default {
    city: process.env.REACT_APP_CITY || "Asheville",
    state: process.env.REACT_APP_STATE || false,
    mailto: process.env.REACT_APP_MAILTO || "inquiries@avl.tips",
    form: {
        url: process.env.REACT_APP_FORM_URL || "https://docs.google.com/forms/d/e/1FAIpQLSeVXG4EkNvg4iyAeYzRz45yiiadNh_OYZ9MG9moS4acJm_OFA/viewform"
    },
    image: {
        src: process.env.REACT_APP_IMAGE_SRC || "/avl.jpg",
        attr: {
            name: process.env.REACT_APP_IMAGE_ATTR_NAME || "mogmismo",
            url: process.env.REACT_APP_IMAGE_ATTR_URL || "https://www.flickr.com/photos/mogmismo/",
        }
    },
    api: {
        dev: {
            url: process.env.REACT_APP_API_DEV_URL || "https://65y0v85nve.execute-api.us-east-1.amazonaws.com/qa",
        },
        prod: {
            url: process.env.REACT_APP_API_PROD_URL || "https://yqzgbw1s1g.execute-api.us-east-1.amazonaws.com/dev"
        }
    }
};