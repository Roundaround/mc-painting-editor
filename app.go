package main

import (
	"archive/zip"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// export const paintingSchema = z.object({
//   id: z.string(),
//   name: z.string().optional(),
//   artist: z.string().optional(),
//   height: z.number().min(1).max(8).default(1),
//   width: z.number().min(1).max(8).default(1),
// });

// export const packSchema = z.object({
//   id: z.string(),
//   name: z.string().optional(),
//   paintings: z.array(paintingSchema).default([]),
// });

type Painting struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Artist string `json:"artist"`
	Height int    `json:"height"`
	Width  int    `json:"width"`
}

type Pack struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Paintings []Painting `json:"paintings"`
}

func (a *App) SelectZipFile() string {
	zipFile, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title:   "Select a zip file",
		Filters: []runtime.FileFilter{{DisplayName: "Zip Files", Pattern: "*.zip"}},
	})
	if err != nil {
		return err.Error()
	}

	archive, err := zip.OpenReader(zipFile)
	defer archive.Close()

	for _, f := range archive.File {
		if f.FileInfo().IsDir() {
			continue
		}

		if f.Name != "custompaintings.json" {
			continue
		}

		fileFromArchive, err := f.Open()
		if err != nil {
			panic(err)
		}

		byteValue, _ := ioutil.ReadAll(fileFromArchive)

		// Parse file as pack json
		var pack Pack
		json.Unmarshal(byteValue, &pack)

		runtime.EventsEmit(a.ctx, "setName", pack.Name)

		fileFromArchive.Close()
	}

	return zipFile
}
