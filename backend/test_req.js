(async () => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: 'hospital',
                name: 'Test Hospital',
                email: `test${Date.now()}@hosp.com`,
                password: 'password',
                registrationNumber: `REG-${Date.now()}`
            })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Data:", data);
    } catch (e) {
        console.error("Error Response:", e.message);
    }
})();
