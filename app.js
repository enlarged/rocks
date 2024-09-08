document.getElementById('login-button').addEventListener('click', async () => {
    const token = document.getElementById('token-input').value.trim();

    if (!token) {
        document.getElementById('error-message').textContent = "Token cannot be empty.";
        return;
    }

    try {
        // Fetch user details
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: { 'Authorization': token }
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            throw new Error(`Invalid token. ${errorData.message}`);
        }

        const userData = await userResponse.json();
        document.getElementById('user-id').textContent = userData.id;
        document.getElementById('user-name').textContent = `${userData.username}#${userData.discriminator}`;
        document.getElementById('user-avatar').src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;

        // Fetch user's guilds
        const guildResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: { 'Authorization': token }
        });

        if (!guildResponse.ok) {
            const errorData = await guildResponse.json();
            throw new Error(`Failed to fetch guilds. ${errorData.message}`);
        }

        const guildsData = await guildResponse.json();
        document.getElementById('server-count').textContent = guildsData.length;

        // Display guilds in sidebar
        const guildList = document.getElementById('guild-list');
        guildList.innerHTML = '';

        guildsData.forEach(guild => {
            const guildItem = document.createElement('div');
            guildItem.classList.add('guild-item');
            guildItem.innerHTML = `
                <img src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png" alt="${guild.name}">
                <span>${guild.name}</span>
                <button class="leave-button" data-guild-id="${guild.id}">Leave Server</button>
            `;
            guildList.appendChild(guildItem);
        });

        // Switch to the dashboard
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('error-message').textContent = error.message;
    }
});

document.getElementById('logout-button').addEventListener('click', () => {
    // Clear the token input and switch back to the login screen
    document.getElementById('token-input').value = '';
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('error-message').textContent = '';
});

document.getElementById('guild-list').addEventListener('click', async (event) => {
    if (event.target.classList.contains('leave-button')) {
        const guildId = event.target.getAttribute('data-guild-id');
        const token = document.getElementById('token-input').value.trim();

        try {
            const leaveResponse = await fetch(`https://discord.com/api/v10/users/@me/guilds/${guildId}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });

            if (!leaveResponse.ok) {
                const errorData = await leaveResponse.json();
                throw new Error(`Failed to leave server. ${errorData.message}`);
            }

            // Remove guild from list
            event.target.parentElement.remove();
            document.getElementById('server-count').textContent = document.querySelectorAll('.guild-item').length;
        } catch (error) {
            console.error('Error leaving server:', error);
        }
    }
});
