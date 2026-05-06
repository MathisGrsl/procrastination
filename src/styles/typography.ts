import { createGlobalStyle } from 'styled-components';

const Typography = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Inter:wght@400;600&family=Poppins:wght@300;400;600&display=swap');

    body {
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
        color: #333;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        color: #2c3e50;
    }

    p {
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        color: #555;
    }

    a {
        font-family: 'Inter', sans-serif;
        color: #3498db;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
            color: #2980b9;
        }
    }
`;

export default Typography;