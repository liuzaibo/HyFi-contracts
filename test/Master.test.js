const HyFiToken = artifacts.require('HyFiToken');
const Master = artifacts.require('Master');
const MockERC20 = artifacts.require('MockERC20');

contract('Master', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.hyfi = await HyFiToken.new('0xb20569782E6471a847Fbd980FbA7ac5Ce6fa1759', { from: alice });
    });

    it('should set correct state variables', async () => {
        this.master = await Master.new(this.hyfi.address, '1000', '0', { from: alice });
        await this.hyfi.transferOwnership(this.master.address, { from: alice });
        const hyfi = await this.master.hyfi();
        const owner = await this.hyfi.owner();
        assert.equal(hyfi.valueOf(), this.hyfi.address);
        assert.equal(owner.valueOf(), this.master.address);
    });

    context('With ERC/LP token added to the field', () => {
        beforeEach(async () => {
            this.lp = await MockERC20.new('LPToken', 'LP', '10000000000', { from: minter });
            await this.lp.transfer(alice, '1000', { from: minter });
            await this.lp.transfer(bob, '1000', { from: minter });
            await this.lp.transfer(carol, '1000', { from: minter });
            this.lp2 = await MockERC20.new('LPToken2', 'LP2', '10000000000', { from: minter });
            await this.lp2.transfer(alice, '1000', { from: minter });
            await this.lp2.transfer(bob, '1000', { from: minter });
            await this.lp2.transfer(carol, '1000', { from: minter });
        });

        it('should allow emergency withdraw', async () => {
            // 100 per block farming rate starting at block 100 with bonus until block 1000
            this.master = await Master.new(this.hyfi.address, '1000', '0', { from: alice });
            await this.master.add('100', this.lp.address, true);
            await this.lp.approve(this.master.address, '1000', { from: bob });
            await this.master.deposit(0, '100', { from: bob });
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '900');
            await this.master.emergencyWithdraw(0, { from: bob });
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '1000');
        });
    });
});
