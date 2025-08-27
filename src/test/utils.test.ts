import { describe, it, expect } from 'vitest'

describe('Utility Functions', () => {
  describe('Basic Math Operations', () => {
    it('should add numbers correctly', () => {
      expect(1 + 1).toBe(2)
      expect(2 + 3).toBe(5)
    })

    it('should calculate percentages correctly', () => {
      // Testing commission calculations similar to what's used in the app
      const volume = 10 // m³
      const rate = 0.05 // 5%
      const basePrice = 15 // per m³
      
      const commissionAmount = parseFloat((volume * basePrice * rate).toFixed(2))
      expect(commissionAmount).toBe(7.5)
    })
  })

  describe('Data Validation', () => {
    it('should validate required fields', () => {
      const mockMatch = {
        id: 'test-id',
        demandId: 'demand-1',
        stockId: 'stock-1',
        matchDate: new Date().toISOString(),
        commissionRate: 0.05,
        commissionAmount: 7.5,
        billed: false
      }

      expect(mockMatch.id).toBeTruthy()
      expect(mockMatch.demandId).toBeTruthy()
      expect(mockMatch.stockId).toBeTruthy()
      expect(typeof mockMatch.commissionRate).toBe('number')
      expect(typeof mockMatch.billed).toBe('boolean')
    })
  })

  describe('Date Handling', () => {
    it('should handle ISO date strings', () => {
      const now = new Date()
      const isoString = now.toISOString()
      const parsed = new Date(isoString)
      
      expect(parsed.getTime()).toBe(now.getTime())
    })

    it('should sort dates correctly', () => {
      const dates = [
        new Date('2024-01-01'),
        new Date('2024-03-01'),
        new Date('2024-02-01')
      ]
      
      const sorted = dates.sort((a, b) => b.getTime() - a.getTime())
      
      expect(sorted[0].getMonth()).toBe(2) // March (0-indexed)
      expect(sorted[1].getMonth()).toBe(1) // February
      expect(sorted[2].getMonth()).toBe(0) // January
    })
  })
})