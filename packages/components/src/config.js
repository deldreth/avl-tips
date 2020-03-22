
export default {
    wc: {
        tag: process.env.REACT_APP_WC_TAG || "avl-tips"
    },
    api: {
        dev: {
            url: process.env.REACT_APP_API_DEV_URL || "https://65y0v85nve.execute-api.us-east-1.amazonaws.com/qa"
        },
        prod: {
            url: process.env.REACT_APP_API_PROD_URL || "https://yqzgbw1s1g.execute-api.us-east-1.amazonaws.com/dev"
        }
    }
};