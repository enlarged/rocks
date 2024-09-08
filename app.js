document.getElementById('login-button').addEventListener('click', async () => {
    const token = document.getElementById('token-input').value;

    if (!token) {
        document.getElementById('error-message').textContent = "Token cannot be empty.";
        return;
    }

    try {
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            throw new Error(`Invalid token. ${errorData.message}`);
        }

        const userData = await userResponse.json();
        document.getElementById('user-id').textContent = userData.id;
        document.getElementById('user-name').textContent = `${userData.username}#${userData.discriminator}`;

        const guildResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!guildResponse.ok) {
            const errorData = await guildResponse.json();
            throw new Error(`Failed to fetch guilds. ${errorData.message}`);
        }

        const guildsData = await guildResponse.json();
        document.getElementById('server-count').textContent = guildsData.length;

        // Switch to dashboard
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('error-message').textContent = error.message;
    }
});

document.getElementById('logout-button').addEventListener('click', () => {
    // Clear the token input and switch back to login screen
    document.getElementById('token-input').value = '';
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('error-message').textContent = '';
});
