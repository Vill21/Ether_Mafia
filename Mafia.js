const Mafia = artifacts.require("Mafia");
const MC = artifacts.require("MafiaCookies");

contract('Mafia', (accounts) => {
    describe('Starting tokens', () => {
        it('should put 100 MC to each account at start', async () => {
            const instance = await Mafia.deployed();
            for (let i = 0; i < 10; ++i) {
                await instance.Ask({from: accounts[i]});
            }
            await instance.gameStart();
            for (let i = 0; i < 10; ++i) {
                let balance = await instance.lookBalance(accounts[i]);
                assert.equal(balance, 100, `100 wasn't in the ${i} account`);
            }
            instance.Reset();
        });
    });
    
    describe('Players turns', () => {
        it('should kill mafias victim', async () => {
            const instance = await Mafia.deployed();
            for (let i = 0; i < 10; ++i) {
                await instance.Ask({from: accounts[i]});
            }
            await instance.gameStart();
            await instance.MafiaKill(5);
            await instance.PolicemanFind(5);
            await instance.DoctorHeal(6);
            assert.equal(instance.players[5].state, instance.States.DEAD, 'mafia is not able to kill');
            instance.Reset();
        });
        it('should heal', async () => {
            const instance = await Mafia.deployed();
            for (let i = 0; i < 10; ++i) {
                await instance.Ask({from: accounts[i]});
            }
            await instance.gameStart();
            await instance.MafiaKill(5);
            await instance.PolicemanFind(5);
            await instance.DoctorHeal(5);
            assert.equal(instance.players[5].state, instance.States.ALIVE, 'doctor is not able to heal');
            instance.Reset();
        });
        it('should find mafia', async () => {
            const instance = await Mafia.deployed();
            for (let i = 0; i < 10; ++i) {
                await instance.Ask({from: accounts[i]});
            }
            await instance.gameStart();
            await instance.MafiaKill(5);
            await instance.PolicemanFind(1);
            await instance.DoctorHeal(5);
            assert.equal(instance.roles_arr[1], instance.Roles.Mafia, 'policeman is not able to find mafia');
            instance.Reset();
        });
        it('should find citizen', async () => {
            const instance = await Mafia.deployed();
            for (let i = 0; i < 10; ++i) {
                await instance.Ask({from: accounts[i]});
            }
            await instance.gameStart();
            await instance.MafiaKill(5);
            await instance.PolicemanFind(9);
            await instance.DoctorHeal(5);
            assert.equal(instance.roles_arr[9], instance.Roles.Citizen, 'policeman is not able to find citizen');
            instance.Reset();
        });
    });

    describe('Bets', () => {
        it('should take bets', async () => {
            const instance = await Mafia.deployed();
            for (let i = 0; i < 10; ++i) {
                await instance.Ask({from: accounts[i]});
            }
            await instance.gameStart();
            for (let i = 0; i < 10; ++i) {
                await instance.Bet(100, {from: accounts[i]});
                let balance = await instance.lookBalance(accounts[i]);
                assert.equal(balance, 0, 'bets taken successfully');
            }
            instance.Reset();
        });
        it('should have mafias bets', async () => {
            const instance = await Mafia.deployed();
            for (let i = 0; i < 10; ++i) {
                await instance.Ask({from: accounts[i]});
            }
            await instance.gameStart();
            for (let i = 0; i < 10; ++i) {
                await instance.Bet(100, {from: accounts[i]});
            }
            assert.equal(instance.Mafia_Bets(), 300, 'mafias bets count wrong');
            instance.Reset();
        });
        it('should have citizens bets', async () => {
            const instance = await Mafia.deployed();
            for (let i = 0; i < 10; ++i) {
                await instance.Ask({from: accounts[i]});
            }
            await instance.gameStart();
            for (let i = 0; i < 10; ++i) {
                await instance.Bet(100, {from: accounts[i]});
            }
            assert.equal(instance.Citizen_Bets(), 700, 'citizen bets count wrong');
            instance.Reset();
        });
    });

    describe('Prizes', () => {
        it('should give prize to mafias if they win', async () => {
            const instance = await Mafia.deployed();
            for (let i = 0; i < 10; ++i) {
                await instance.Ask({from: accounts[i]});
            }
            await instance.gameStart();
            for (let i = 0; i < 10; ++i) {
                await instance.Bet(100, {from: accounts[i]});
            }
            await instance.MafiaWin();
            for (let i = 0; i < 3; ++i) {
                let balance = await instance.lookBalance(accounts[i]);
                assert.equal(balance, 333, 'mafias havent received the prize');
            }
            instance.Reset();
        });
        it('should give prize to citizens if they win', async () => {
            const instance = await Mafia.deployed();
            for (let i = 0; i < 10; ++i) {
                await instance.Ask({from: accounts[i]});
            }
            await instance.gameStart();
            for (let i = 0; i < 10; ++i) {
                await instance.Bet(70, {from: accounts[i]});
            }
            await instance.CitizenWin();
            for (let i = 3; i < 10; ++i) {
                let balance = await instance.lookBalance(accounts[i]);
                assert.equal(balance, 142, 'citizens havent received the prize');
            }
            instance.Reset();
        });
    });
});