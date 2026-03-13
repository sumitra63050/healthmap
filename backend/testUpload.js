const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function testUpload() {
    try {
        // Create a dummy file
        fs.writeFileSync('test_report.pdf', 'dummy content');

        const email = 'testpatient' + Date.now() + '@example.com';
        await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test Patient',
            email: email,
            password: 'password123',
            role: 'patient'
        });

        // Log in as patient to get token
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: email,
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Got token');

        // Prepare form data
        const form = new FormData();
        form.append('file', fs.createReadStream('test_report.pdf'));
        form.append('reportType', 'Blood Test');

        // Upload
        console.log('Uploading...');
        const response = await axios.post('http://localhost:5000/api/patient/upload', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': token
            }
        });

        console.log('Upload Success:', response.data);
    } catch (err) {
        if (err.response) {
            console.error('Upload Error:', err.response.status, err.response.data);
        } else {
            console.error('Upload Error:', err.message);
        }
    }
}

testUpload();
