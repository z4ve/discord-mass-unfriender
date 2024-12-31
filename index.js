(async () => {
    const token = 'your token here';

    try {
        const fs = require('fs').promises;
        const whitelist = new Set(await fs.readFile('whitelisted.txt', 'utf8').then(content => content.split('\n').filter(id => id.trim())));

        const response = await fetch(`https://discord.com/api/users/@me/relationships`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': token,
            }
        });

        for (let friends of await response.json()) {
            const { user } = friends;

            if (!whitelist.has(user.id)) {
                await fetch(`https://discord.com/api/users/@me/relationships/${user.id}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': token,
                    }
                });

                console.log(`friend deleted: ${user.username} (${user.global_name})`);
            } else {
                console.log(`skipped: ${user.username} (${user.global_name}) - whitelisted`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
})();