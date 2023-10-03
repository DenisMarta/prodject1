package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/hashicorp/vault/api"
	vault "github.com/hashicorp/vault/api"
)

var httpClient = &http.Client{
	Timeout: 10 * time.Second,
}

func main() {
	Info("Creating vault client")
	client, err := api.NewClient(&api.Config{Address: SetEnv("VAULT_ADDR"), HttpClient: httpClient})
	CheckIfError(err)
	client.SetToken(SetEnv("VAULT_TOKEN"))
	Info("Vault Client Created")

	Info("Checking Vault Status")
	sealStatus, err := client.Sys().SealStatus()
	CheckIfError(err)
	if !sealStatus.Sealed {
		Info("Vault is already unsealed")
		os.Exit(0)
	}
	Info("Vault sealed")

	UnsealVault(client)
	c := client.Logical()
	DisableKubeAuth(c)
	EnableKubeAuth(c)
	ConfigKubeAuth(c)
	CreateKubeAuthRole(c)
}

func UnsealVault(client *vault.Client) {
	Info("Unsealing the vault")
	unsealKeys := strings.Split(SetEnv("UNSEAL_KEYS"), ",")
	for _, v := range unsealKeys {
		_, err := client.Sys().Unseal(v)
		CheckIfError(err)
	}
	Info("Vault unsealed")
}

func DisableKubeAuth(c *vault.Logical) {
	Info("Disabling kubernetes auth")
	kdelete, err := c.Delete("sys/auth/kubernetes")
	CheckIfError(err)

	if kdelete != nil {
		Info("Disabling kubernetes auth failed %v", kdelete)
	}
	Info("Disabled kubernetes auth")
}

func EnableKubeAuth(c *vault.Logical) {
	Info("Enabling kubernetes auth")
	kauth, err := c.Write("sys/auth/kubernetes", map[string]interface{}{
		"type":        "kubernetes",
		"description": "k8s backend for development environment",
	})
	CheckIfError(err)
	if kauth != nil {
		Info("Enabling kubernetes auth failed %v", kauth)
		return
	}
	Info("Enabled kubernetes auth")
}

func ConfigKubeAuth(c *vault.Logical) {
	Info("Writing kubernetes config")
	kconfig, err := c.Write("auth/kubernetes/config", map[string]interface{}{
		"issuer":          "https://kubernetes.default.svc.cluster.local",
		"kubernetes_host": "https://" + SetEnv("KUBERNETES_SERVICE_HOST") + ":" + SetEnv("KUBERNETES_SERVICE_PORT"),
	})
	CheckIfError(err)
	if kconfig != nil {
		Info("Writing kubernetes config failed %v", kconfig)
		return
	}
}

func CreateKubeAuthRole(c *vault.Logical) {
	Info("Writing kubernetes role")
	krole, err := c.Write("auth/kubernetes/role/dna", map[string]interface{}{
		"bound_service_account_names":      "*",
		"bound_service_account_namespaces": "*",
		"policies":                         "dna-policy",
	})
	CheckIfError(err)

	if krole != nil {
		Info("Writing kubernetes role failed %v", krole)
		return
	}
}
func SetEnv(key string) string {
	value, ok := os.LookupEnv(key)
	if !ok {
		CheckIfError(errors.New("Missing environment value : " + key))
	}
	return value
}

func CheckIfError(err error) {
	if err == nil {
		return
	}

	fmt.Printf("\x1b[31;1m%s\x1b[0m\n", fmt.Sprintf("error: %s", err))
	os.Exit(1)
}

func Info(format string, args ...interface{}) {
	fmt.Printf("\x1b[34;1m%s\x1b[0m\n", fmt.Sprintf(format, args...))
}

func Warning(format string, args ...interface{}) {
	fmt.Printf("\x1b[36;1m%s\x1b[0m\n", fmt.Sprintf(format, args...))
}