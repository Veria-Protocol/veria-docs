// Screen a wallet address with Veria
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type ScreenRequest struct {
	Input string `json:"input"`
}

type ScreenResponse struct {
	Score     int    `json:"score"`
	Risk      string `json:"risk"`
	Chain     string `json:"chain"`
	Resolved  string `json:"resolved"`
	LatencyMs int    `json:"latency_ms"`
	Details   struct {
		SanctionsHit bool     `json:"sanctions_hit"`
		PepHit       bool     `json:"pep_hit"`
		WatchlistHit bool     `json:"watchlist_hit"`
		CheckedLists []string `json:"checked_lists"`
		AddressType  string   `json:"address_type"`
	} `json:"details"`
}

func screenAddress(address string) (*ScreenResponse, error) {
	apiKey := os.Getenv("VERIA_API_KEY")

	reqBody, _ := json.Marshal(ScreenRequest{Input: address})
	req, _ := http.NewRequest("POST", "https://api.veria.cc/v1/screen", bytes.NewBuffer(reqBody))
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result ScreenResponse
	json.NewDecoder(resp.Body).Decode(&result)
	return &result, nil
}

func main() {
	result, err := screenAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
	if err != nil {
		fmt.Println("Error:", err)
		os.Exit(1)
	}

	fmt.Printf("Risk: %s\n", result.Risk)
	fmt.Printf("Score: %d\n", result.Score)
	fmt.Printf("Sanctions hit: %v\n", result.Details.SanctionsHit)

	if result.Risk == "high" || result.Risk == "critical" {
		fmt.Println("BLOCKED: High risk address")
		os.Exit(1)
	}

	fmt.Println("ALLOWED: Address is safe")
}
