const resolvers = {
	Query: {
		radios: async (_, { skip, limit }, { Radio }) => {
			return Radio.find({}).sort('-createdAt').skip(skip).limit(limit).populate({
				path: 'themes',
				model: 'Theme',
				options: { sort: { createdAt: -1 } }
			});
		},
		radio: (_, { radioId }, { Radio }) => {
			return Radio.findOne({ _id: radioId }).populate({
				path: 'themes',
				model: 'Theme',
				options: { sort: { createdAt: -1 } }
			});
		},
		fetchMoreRadios: async (_, { skip, limit }, { Radio }) => {
			const radios = await Radio.find({}).sort('-createdAt').skip(skip).limit(limit);

			const totalDocs = await Radio.countDocuments();
			if (!skip) skip = 0;
			if (!limit) limit = 30;

			const hasMore = totalDocs > skip + limit;

			return { radios, hasMore };
		},
		radioThemes: (_, { radioId }, { Theme }) => {
			return Theme.find({ radioId }).sort('-createdAt');
		},
		themes: (_, args, { Theme }) => {
			return Theme.find()
				.populate({
					path: 'comments',
					model: 'Comment',
					options: { sort: { createdAt: -1 } }
				})
				.sort('-createdAt');
		},
		theme: (_, { themeId }, { Theme }) => {
			return Theme.findOne({ _id: themeId }).populate({
				path: 'comments',
				model: 'Comment',
				options: { sort: { createdAt: -1 } }
			});
		},
		themeComments: async (_, { themeId, skip, limit }, { Comment }) => {
			const comments = await Comment.find({ themeId }).sort('-createdAt').skip(skip).limit(limit);

			const totalCounts = await Comment.countDocuments({ themeId });
			if (!skip) skip = 0;
			if (!limit) limit = 30;
			const hasMore = totalCounts > skip + limit;

			return {
				comments,
				hasMore
			};
		},
		comments: (_, { limit, skip }, { Comment }) => {
			return Comment.find({}).sort('-createdAt').limit(limit).skip(skip).populate({
				path: 'themeId',
				model: 'Theme'
			});
		},
		comment: (_, { _id }, { Comment }) => {
			return Comment.findById(_id).populate({
				path: 'themeId',
				model: 'Theme'
			});
		}
	},
	Mutation: {
		createRadio: async (_, { data: { youtubeUrl, times, broadCastingDate } }, { Radio }) => {
			try {
				const newRadio = await new Radio({
					youtubeUrl,
					times,
					broadCastingDate
				}).save();

				return newRadio;
			} catch (error) {
				console.log(error);
				Promise.reject('error');
			}
		},
		deleteRadio: async (_, { radioId }, { Radio, Theme, Comment }) => {
			const deletedRadio = await Radio.findOneAndDelete({ _id: radioId });
			deletedRadio.themes.forEach(async (themeId) => {
				const deletedTheme = await Theme.findOneAndDelete({ _id: themeId });
				deletedTheme.comments.forEach(async (commentId) => {
					await Comment.findOneAndDelete({ _id: commentId });
				});
			});

			return deletedRadio;
		},
		updateRadio: async (_, { radioId, data: { youtubeUrl, times, broadCastingDate } }, { Radio }) => {
			try {
				const updateData = {};
				if (youtubeUrl) updateData.youtubeUrl = youtubeUrl;
				if (broadCastingDate) updateData.broadCastingDate = broadCastingDate;
				if (times) updateData.times = times;

				return Radio.findOneAndUpdate({ _id: radioId }, { $set: updateData }, { new: true });
			} catch (error) {
				Promise.reject(error);
			}
		},
		createTheme: async (_, { data: { thumbnail, title, radioId, description } }, { Radio, Theme }) => {
			const newTheme = await new Theme({
				title,
				thumbnail,
				radioId,
				description
			}).save();
			await Radio.findOneAndUpdate({ _id: radioId }, { $push: { themes: newTheme._id } });
			return newTheme;
		},
		deleteTheme: async (_, { themeId }, { Theme, Comment }) => {
			const deletedTheme = await Theme.findOneAndDelete({ _id: themeId });
			deletedTheme.comments.forEach(async (commentId) => {
				await Comment.findOneAndDelete({ _id: commentId });
			});
			return deletedTheme;
		},
		updateTheme: async (_, { themeId, data: { title, thumbnail, description } }, { Theme }) => {
			try {
				const updateData = {};
				if (title) updateData.title = title;
				if (thumbnail) updateData.thumbnail = thumbnail;
				if (description) updateData.description = description;

				return Theme.findOneAndUpdate({ _id: themeId }, { $set: updateData }, { new: true });
			} catch (error) {
				Promise.reject(error);
			}
		},
		createComment: async (_, { data: { message, radioName, themeId, userId } }, { Comment, Theme }) => {
			const existComment = await Comment.exists({
				message,
				themeId
			});

			if (existComment) throw new Error('同じはがきが見つかりました。');
			const newComment = await new Comment({
				message,
				radioName,
				themeId,
				userId,
				createdAt: new Date().toISOString()
			}).save();

			await Theme.findOneAndUpdate({ _id: themeId }, { $push: { comments: newComment._id } });
			return newComment;
		},
		deleteComment: async (_, { commentId }, { Comment, Theme }) => {
			const deletedComment = await Comment.findOneAndDelete({ _id: commentId });
			await Theme.findOneAndUpdate({ _id: deletedComment.themeId }, { $pull: { comments: deletedComment._id } });
			return deletedComment;
		},
		deleteManyComments: async (_, { themeId, commentIds }, { Comment, Theme }) => {
			await Comment.deleteMany({ _id: { $in: commentIds } });
			await Theme.updateMany({ _id: themeId }, { $pull: { comments: { $in: commentIds } } }, { multi: true });
			return
		},
		updateComment: async (_, { commentId, data: { message, radioName, likes } }, { Comment }) => {
			try {
				const updateData = {};
				if (message) updateData.message = message;
				if (radioName) updateData.radioName = radioName;
				if (likes) updateData.likes = likes;

				return Comment.findOneAndUpdate({ _id: commentId }, { $set: updateData }, { new: true });
			} catch (error) {
				Promise.reject(error);
			}
		},
		likeComment: async (_, { commentId }, { Comment }) => {
			try {
				return await Comment.findOneAndUpdate({ _id: commentId }, { $inc: { likes: +1 } }, { new: true });
			} catch (error) {
				Promise.reject(error);
			}
		},
		unlikeComment: async (_, { commentId }, { Comment }) => {
			try {
				return await Comment.findOneAndUpdate({ _id: commentId }, { $inc: { likes: -1 } }, { new: true });
			} catch (error) {
				Promise.reject(error);
			}
		},
		resetDB: async (_, args, { Radio, Theme, Comment }) => {
			await Radio.deleteMany({});
			await Theme.deleteMany({});
			const comments = await Comment.deleteMany({});
			return comments;
		},
		resetThemeComments: async (_, { themeId }, { Theme, Comment }) => {
			const deletedComment = await Comment.deleteMany({ themeId });
			await Theme.findOneAndUpdate({ _id: themeId }, { comments: [] });
			return deletedComment;
		}
	}
};

module.exports = resolvers;
