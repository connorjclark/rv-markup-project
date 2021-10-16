const rewire = require("rewire")
const scorer = rewire("./scorer")
const parseTagCounts = scorer.__get__("parseTagCounts")
// @ponicode
describe("scorer.tagCountsToScore", () => {
    test("0", () => {
        let callFunction = () => {
            scorer.tagCountsToScore([10, 0, 0.0])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            scorer.tagCountsToScore([10, 0, 0])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            scorer.tagCountsToScore([-1, 1, 10])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            scorer.tagCountsToScore([1, -1, 0])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            scorer.tagCountsToScore([-10, 1, -1])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            scorer.tagCountsToScore(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("parseTagCounts", () => {
    test("0", () => {
        let callFunction = () => {
            parseTagCounts("Hello, world!")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            parseTagCounts("Foo bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            parseTagCounts("foo bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            parseTagCounts("This is a Text")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            parseTagCounts(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
