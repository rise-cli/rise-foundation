module.exports = (test) => {
    test('one', async (trigger, expect) => {
        const res = await trigger('testDb')
        expect(res).toBe(2)
    })
}
