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

import { getStorage, ref, deleteObject } from "firebase/storage";
import { storage } from "../firebaseConfig";

import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { error } from "console";

const formSchema = z.object({
  title: z.string().min(1, "title is required"),
  voiceType: z.string().min(1, "voice is required"),
  text: z.string().min(1, "text is required"),
  thumbnailPrompt: z.string().min(1, "prompt is required"),
});

const voiceTypes = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

export function ProfileForm() {
  const { toast } = useToast();

  // Book states
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // Audiobook states
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [filepath, setFilepath] = useState("");
  const [voiceType, setVoiceType] = useState<string | null>(null);

  //   Thumbnail states
  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumbnailFilepath, setThumbnailFilepath] = useState("");

  useEffect(() => {
    console.log(thumbnailUrl)
  },[thumbnailUrl])

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
        body: JSON.stringify({ title, text, voiceType, audioUrl, filepath, thumbnailUrl, thumbnailFilepath }),
      });
      if (response.ok) {
        toast({
          title: "Successfully added audiobook",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add audiobook');
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
    console.log(text, voiceType, audioUrl, filepath, thumbnailUrl, thumbnailFilepath)
    addToDatabase();
  }


  //   Generate audio
  function generateAudio() {
    setIsGenerating(true);

    if (!voiceType) {
      toast({
        title: "Please Choose a Voice",
      });
    }
    if (!text) {
      toast({
        title: "Please input text",
      });
    }

    const fetchPosts = async (text: any) => {
      try {
        const response = await fetch(`/api/audio`, {
          method: "POST",
          body: JSON.stringify({ text, voiceType }),
        });

        const data = await response.json();
        console.log("Response data:", data);
        setAudioUrl(data.audioUrl);
        setFilepath(data.filepath);
        if (response.ok) {
          toast({
            title: "Successfully Generated Audio",
          });
        }
        setIsGenerating(false);
        return data; // This will be the response from your API
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Failed to Generate Audio",
        });
        setIsGenerating(false);
        throw error;
      }
    };

    fetchPosts(text);
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

  //   Generate audio
  function generateThumbnail() {
    setIsGeneratingThumbnail(true);

    if (!thumbnailPrompt) {
      toast({
        title: "Please Write a Thumbnail Prompt",
      });
    }

    const createThumbnail = async (text: any) => {
      try {
        const response = await fetch(`/api/thumbnail`, {
          method: "POST",
          body: JSON.stringify({ thumbnailPrompt }),
        });

        const data = await response.json();
        console.log("Response data:", data);
        console.log(data.thumbnailUrl)
        setThumbnailUrl(data.thumbnailUrl);
        setThumbnailFilepath(data.filepath);
        if (response.ok) {
          toast({
            title: "Successfully Generated Thumbnail",
          });
        }
        setIsGeneratingThumbnail(false);
        return data; // This will be the response from your API
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Failed to Generate Thumbnail",
        });
        setIsGeneratingThumbnail(false);
        throw error;
      }
    };

    createThumbnail(text);
  }

  //   Delete thumbnail
  function deleteThumbnail(filepath: string) {
    console.log(filepath);

    // Create a reference to the file to delete
    const thumbnailRef = ref(storage, filepath);

    try {
      deleteObject(thumbnailRef);
      setThumbnailUrl('');
      console.log("successfully deleted thumbnail");
      // todo: add toast here
      toast({
        title: "Successfully Deleted Thumbnail",
      });
    } catch (error) {
      console.log("failed to delete thumbnail", error);
      toast({
        title: "Failed to Delete Thumbnail",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        e.preventDefault()
        console.log('test')
        onSubmit()
      }} className="space-y-8">

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
        {/* Book Text Prompt for Generating the Audiobook */}
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="text" className="text-2xl">
                Book Passage
              </Label>
              <Textarea
                id="text"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setText(e.target.value);
                }}
                className="h-[25vh] text-lg text-[#D9D9D9] border-[#1E1E1E] bg-[#1E1E1E]"
              />
              <FormDescription>Write the book text here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Generated audio section, with generate button, generated audio, and delete button */}
        <div className="w-full flex justify-center gap-5 items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => generateAudio()}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
          {audioUrl && (
            <>
              <audio controls>
                <source src={audioUrl} type="audio/mp3" />
              </audio>
              {/* <AudioAnalyzer audioUrl={audioUrl} /> */}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                    setText('')
                    deleteAudio(filepath)
                }}
              >
                Delete
              </Button>
            </>
          )}
        </div>

        {/* Prompt for generating the thumbnail */}
        <FormField
          control={form.control}
          name="thumbnailPrompt"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="text" className="text-2xl">
                Thumbnail Prompt
              </Label>
              <Textarea
                id="text"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setThumbnailPrompt(e.target.value);
                }}
                className="h-[25vh] text-lg text-[#D9D9D9] border-[#1E1E1E] bg-[#1E1E1E]"
              />
              <FormDescription>
                Write your thumbnail prompt here
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Generate thumbnail section */}
        <div className="w-full flex justify-center gap-5 items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => generateThumbnail()}
          >
            {isGeneratingThumbnail ? "Generating..." : "Generate"}
          </Button>
          {thumbnailUrl && (
            <>
              <img src={thumbnailUrl} width={250} height={250} alt="thumbnail" />
              {/* <AudioAnalyzer audioUrl={audioUrl} /> */}
              <Button
                type="button"
                variant="outline"
                onClick={() => deleteThumbnail(thumbnailFilepath)}
              >
                Delete
              </Button>
            </>
          )}
        </div>

        <Button type="submit" variant="outline" className="text-[#D9D9D9] bg-[#1E1E1E] border-[#1E1E1E]">
          Save Audiobook
        </Button>
      </form>
    </Form>
  );
}
