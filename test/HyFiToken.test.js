const { expectRevert } = require('@openzeppelin/test-helpers');
const HyFiToken = artifacts.require('HyFiToken');

contract('HyFiToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.hyfi = await HyFiToken.new('0xb20569782E6471a847Fbd980FbA7ac5Ce6fa1759', { from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.hyfi.name();
        const symbol = await this.hyfi.symbol();
        const decimals = await this.hyfi.decimals();
        assert.equal(name.valueOf(), 'hyfi.finance');
        assert.equal(symbol.valueOf(), 'HyFi');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.hyfi.mint(alice, '100', { from: alice });
        await this.hyfi.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.hyfi.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.hyfi.totalSupply();
        const aliceBal = await this.hyfi.balanceOf(alice);
        const bobBal = await this.hyfi.balanceOf(bob);
        const carolBal = await this.hyfi.balanceOf(carol);
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.hyfi.mint(alice, '100', { from: alice });
        await this.hyfi.mint(bob, '1000', { from: alice });
        await this.hyfi.transfer(carol, '10', { from: alice });
        await this.hyfi.transfer(carol, '100', { from: bob });
        const totalSupply = await this.hyfi.totalSupply();
        const aliceBal = await this.hyfi.balanceOf(alice);
        const bobBal = await this.hyfi.balanceOf(bob);
        const carolBal = await this.hyfi.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '10000000000000000000001100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.hyfi.mint(alice, '100', { from: alice });
        await expectRevert(
            this.hyfi.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.hyfi.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
