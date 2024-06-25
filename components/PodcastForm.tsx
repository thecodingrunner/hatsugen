"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import AudioAnalyzer from "./AudioAnalyzer";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import {
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebaseConfig";

import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { error } from "console";

const formSchema = z.object({
  title: z.string().min(1, "title is required"),
  initialAudioUrl: z.string().min(1, "audio is required"),
  initialText: z.string().min(1, "text is required"),
  finalText: z.string().min(1, "text is required"),
  finalAudioUrl: z.string().min(1, "audio is required"),
  voiceType: z.string().min(1, "voice is required"),
});

const voiceTypes = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

export function PodcastForm() {
  const { toast } = useToast();

  // Text states
  const [title, setTitle] = useState("");
  const [initialText, setInitialText] = useState("");
  const [finalText, setFinalText] = useState("");

  // Podcast states
  const [audioFile, setAudioFile] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [initialAudioUrl, setInitialAudioUrl] = useState<string | null>(null);
  const [initialAudioFilepath, setInitialAudioFilepath] = useState("");
  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalAudioUrl, setFinalAudioUrl] = useState<string | null>(null);
  const [finalAudioFilepath, setFinalAudioFilepath] = useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      text: "",
      thumbnailPrompt: "",
    },
  });

  async function addToDatabase() {
    try {
      const response = await fetch(`/api/audiobook/new`, {
        method: "POST",
        body: JSON.stringify({
          title,
          text,
          voiceType,
          audioUrl,
          filepath,
          thumbnailUrl,
          thumbnailFilepath,
        }),
      });
      if (response.ok) {
        toast({
          title: "Successfully added audiobook",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add audiobook");
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Failed to add audiobook",
        description: error.message,
      });
    }
  }

  // 2. Define a submit handler.
  function onSubmit() {
    console.log(
      text,
      voiceType,
      audioUrl,
      filepath,
      thumbnailUrl,
      thumbnailFilepath
    );
    addToDatabase();
  }

  async function uploadAudio() {
    try {
      // Create a reference to the file location in Firebase Storage
      const fileRef = ref(storage, `uploads/${audioFile.name}`);

      // Upload the file
      await uploadBytes(fileRef, audioFile);

      // Get the download URL
      const url = await getDownloadURL(fileRef);

      setInitialAudioUrl(url);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file: ", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setUploading(false);
    }
  }

  //   Generate audio
  async function generateText() {
    setIsGenerating(true);
    console.log(initialAudioUrl);

    const convertToText = async (audioUrl) => {
      try {
        const response = await fetch(`/api/text`, {
          method: "POST",
          body: JSON.stringify( audioUrl ),
        });

        const data = await response.json();
        console.log("Response data:", data);
        setInitialText(data.text);
        if (response.ok) {
          toast({
            title: "Successfully Generated Text",
          });
        }
        setIsGenerating(false);
        return data; // This will be the response from your API
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Failed to Generate Text",
        });
        setIsGenerating(false);
        throw error;
      }
    };

    await uploadAudio();
    convertToText(initialAudioUrl);
  }

  //   Delete audio
  function deleteAudio(filepath: string) {
    console.log(filepath);

    // Create a reference to the file to delete
    const audioRef = ref(storage, filepath);

    try {
      deleteObject(audioRef);
      setAudioUrl(null);
      console.log("successfully deleted audio");
      // todo: add toast here
      toast({
        title: "Successfully Deleted Audio",
      });
    } catch (error) {
      console.log("failed to delete audio", error);
      toast({
        title: "Failed to Delete Audio",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("test");
          onSubmit();
        }}
        className="space-y-8 pb-10"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="text" className="text-2xl">
                Book Title
              </Label>
              <Input
                id="text"
                type="text"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setTitle(e.target.value);
                }}
                className="text-lg text-[#D9D9D9] border-[#1E1E1E] bg-[#1E1E1E]"
              />
              <FormDescription>Write the book title here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File */}
        <FormField
          control={form.control}
          name="initialAudioUrl"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="text" className="text-2xl">
                Recorder Audio
              </Label>
              <Input
                id="text"
                type="file"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setAudioFile(e.target.files[0]);
                  console.log(e.target.files[0]);
                }}
                className="text-lg text-[#D9D9D9] border-[#1E1E1E] bg-[#1E1E1E]"
              />
              <FormDescription>
                Attach your podcast contents here
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Generated audio section, with generate button, generated audio, and delete button */}
        <div className="w-full flex justify-center gap-5 items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => generateText()}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
          {initialText && (
            <>
              <p>{initialText}</p>
            </>
          )}
        </div>

        <Select
          onValueChange={(e) => {
            console.log(e);
            setVoiceType(e);
          }}
          required
        >
          <SelectTrigger className="w-[180px] bg-[#D9D9D9]">
            <SelectValue placeholder="Voice" />
          </SelectTrigger>
          <SelectContent className="bg-[#D9D9D9]">
            {voiceTypes.map((voice) => (
              <SelectItem
                key={voice}
                value={voice}
                className="bg-[#D9D9D9] focus:bg-[#1E1E1E] focus:text-[#D9D9D9]"
              >
                {voice.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" variant="outline">
          Save Audiobook
        </Button>
      </form>
    </Form>
  );
}
