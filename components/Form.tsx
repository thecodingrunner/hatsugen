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

const formSchema = z.object({
  text: z.string().min(1, "text is required"),
});

const voiceTypes = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

export function ProfileForm() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [filepath, setFilepath] = useState("");
  const { toast } = useToast();
  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  useEffect(() => {
    console.log(text);
  }, [text]);

  function generateAudio() {
    setIsGenerating(true)

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
        const response = await fetch(`/api`, {
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
        setIsGenerating(false)
        return data; // This will be the response from your API
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Failed to Generate Audio",
        });
        setIsGenerating(false)
        throw error;
      }
    };

    fetchPosts(text);
  }

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    async function addToDatabase() {
      try {
        const response = await fetch(`/api/audiobook/new`, {
          method: "POST",
          body: JSON.stringify({ text, voiceType, audioUrl, filepath }),
        });
        if (response.ok) {
          toast({
            title: "Successfully added audiobook",
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Failed to add audiobook",
        });
      }
    }

    addToDatabase();
  }

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                value={voice}
                className="bg-[#D9D9D9] focus:bg-[#1E1E1E] focus:text-[#D9D9D9]"
              >
                {voice.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="text">Text</Label>
              <Textarea
                id="text"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setText(e.target.value);
                }}
                className="h-[40vh] text-lg border-2 border-[#1E1E1E]"
              />
              <FormDescription>Paste the book text here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-center gap-5 items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => generateAudio()}
          >
            Generate
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
                onClick={() => deleteAudio(filepath)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
        <Button type="submit" variant="outline">
          Save Audiobook
        </Button>
      </form>
    </Form>
  );
}
