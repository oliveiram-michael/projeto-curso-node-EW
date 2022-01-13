const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'Erick@32123123'
const HASH = '$2b$04$cNvBbRS.iVjWoBM25cRoxefgf.S/1Cl31DeQZ1VkXs6jMqy7sjKrS'
describe('UserHelper test suite', function () {
    it('Deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length > 10)
    })

    it('Deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    })

    // it()
})