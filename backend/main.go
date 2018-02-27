package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis"
	"math/rand"
	"time"
)

type Item struct {
	Name, Text string
	Lat, Lng   float64
}
type Items struct {
	Items  []Item
	Length int
}

var letterRunes = []rune("abcde fghij klmno pqrst uvwxy zABCD EFGHI JKLMN OPQRS TUVWX YZ")

func main() {
	client := redis.NewClient(&redis.Options{
		Addr:     "127.0.0.1:6379",
		Password: "",
		DB:       0,
	})
	pong, err := client.Ping().Result()
	if err != nil {
		panic(fmt.Sprintf("Redis is unreachable: %+v", err))
	}
	fmt.Println(pong, err)
	var items Items

	for i := 0; i < 10; i++ {
		mod := 1.0
		if rand.Float64() > 0.5 {
			mod = -1.0
		}
		i := Item{
			Name: RandStringRunes(rand.Intn(50)),
			Text: RandStringRunes(rand.Intn(50)),
			Lat:  55.758914 + mod*rand.Float64()/50,
			Lng:  37.656261 + mod*rand.Float64()/50,
		}
		items.Items = append(items.Items, i)
	}
	items.Length = len(items.Items)

	err = client.Set("testkey", "testvalue1", time.Hour).Err()
	if err != nil {
		panic(fmt.Sprintf("cannot set item: %+v", err))
	}
	_, err = client.Get("testkey").Result()
	if err != nil {
		panic(fmt.Sprintf("cannot get item: %+v", err))
	}

	itemsJson, err := json.Marshal(items)
	client.Set("items", itemsJson, time.Hour).Err()

	for i, e := range items.Items {
		client.Set(fmt.Sprintf("items__%d__name", i), e.Name, time.Hour)
		client.Set(fmt.Sprintf("items__%d__text", i), e.Text, time.Hour)
		client.Set(fmt.Sprintf("items__%d__lat", i), e.Lat, time.Hour)
		client.Set(fmt.Sprintf("items__%d__lng", i), e.Lng, time.Hour)
	}
	fmt.Println("OK!")
}

func RandStringRunes(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
